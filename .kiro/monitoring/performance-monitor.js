/**
 * Performance Monitoring System
 * Tracks app performance and stores metrics in SQLite
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = [];
        this.observers = [];
        this.startTime = performance.now();
        this.init();
    }

    init() {
        // Initialize performance observers
        this.initNavigationTiming();
        this.initResourceTiming();
        this.initUserTiming();
        this.initLongTaskObserver();
        this.initLayoutShiftObserver();
        this.initLargestContentfulPaint();
        
        // Start periodic collection
        this.startPeriodicCollection();
    }

    // Core Web Vitals - Largest Contentful Paint
    initLargestContentfulPaint() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                
                this.recordMetric({
                    type: 'core_web_vital',
                    name: 'largest_contentful_paint',
                    value: lastEntry.startTime,
                    timestamp: Date.now(),
                    good_threshold: 2500,
                    needs_improvement_threshold: 4000
                });
            });
            
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
            this.observers.push(observer);
        }
    }

    // Core Web Vitals - Cumulative Layout Shift
    initLayoutShiftObserver() {
        if ('PerformanceObserver' in window) {
            let clsValue = 0;
            
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                
                this.recordMetric({
                    type: 'core_web_vital',
                    name: 'cumulative_layout_shift',
                    value: clsValue,
                    timestamp: Date.now(),
                    good_threshold: 0.1,
                    needs_improvement_threshold: 0.25
                });
            });
            
            observer.observe({ entryTypes: ['layout-shift'] });
            this.observers.push(observer);
        }
    }

    // Long Task Observer (for responsiveness)
    initLongTaskObserver() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.recordMetric({
                        type: 'responsiveness',
                        name: 'long_task',
                        value: entry.duration,
                        timestamp: Date.now(),
                        details: {
                            startTime: entry.startTime,
                            attribution: entry.attribution
                        }
                    });
                }
            });
            
            observer.observe({ entryTypes: ['longtask'] });
            this.observers.push(observer);
        }
    }

    // Navigation Timing
    initNavigationTiming() {
        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            
            if (navigation) {
                this.recordMetric({
                    type: 'navigation',
                    name: 'dom_content_loaded',
                    value: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                    timestamp: Date.now()
                });

                this.recordMetric({
                    type: 'navigation',
                    name: 'load_complete',
                    value: navigation.loadEventEnd - navigation.loadEventStart,
                    timestamp: Date.now()
                });

                this.recordMetric({
                    type: 'navigation',
                    name: 'total_load_time',
                    value: navigation.loadEventEnd - navigation.fetchStart,
                    timestamp: Date.now()
                });
            }
        });
    }

    // Resource Timing
    initResourceTiming() {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.initiatorType === 'script' || entry.initiatorType === 'css') {
                    this.recordMetric({
                        type: 'resource',
                        name: entry.initiatorType + '_load_time',
                        value: entry.responseEnd - entry.startTime,
                        timestamp: Date.now(),
                        details: {
                            name: entry.name,
                            size: entry.transferSize
                        }
                    });
                }
            }
        });
        
        observer.observe({ entryTypes: ['resource'] });
        this.observers.push(observer);
    }

    // User Timing (for custom measurements)
    initUserTiming() {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                this.recordMetric({
                    type: 'user_timing',
                    name: entry.name,
                    value: entry.duration || entry.startTime,
                    timestamp: Date.now(),
                    entryType: entry.entryType
                });
            }
        });
        
        observer.observe({ entryTypes: ['measure', 'mark'] });
        this.observers.push(observer);
    }

    // Record a performance metric
    recordMetric(metric) {
        const enrichedMetric = {
            ...metric,
            id: this.generateId(),
            session_id: this.getSessionId(),
            user_agent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            connection: this.getConnectionInfo()
        };

        this.metrics.push(enrichedMetric);
        
        // Store in SQLite if available
        this.storeMetricInDB(enrichedMetric);
        
        // Check for performance issues
        this.checkPerformanceThresholds(enrichedMetric);
    }

    // Store metric in SQLite database
    async storeMetricInDB(metric) {
        try {
            // This would use the SQLite MCP to store metrics
            console.log('📊 Performance Metric:', metric);
            
            // In real implementation, this would call:
            // await mcp_sqlite_write_query(`
            //     INSERT INTO performance_metrics 
            //     (type, name, value, timestamp, session_id, details) 
            //     VALUES (?, ?, ?, ?, ?, ?)
            // `, [metric.type, metric.name, metric.value, metric.timestamp, metric.session_id, JSON.stringify(metric.details)]);
            
        } catch (error) {
            console.error('Failed to store performance metric:', error);
        }
    }

    // Check performance thresholds and alert
    checkPerformanceThresholds(metric) {
        const alerts = [];

        // Core Web Vitals thresholds
        if (metric.type === 'core_web_vital') {
            if (metric.name === 'largest_contentful_paint' && metric.value > 4000) {
                alerts.push(`🐌 Poor LCP: ${metric.value}ms (should be < 2500ms)`);
            }
            
            if (metric.name === 'cumulative_layout_shift' && metric.value > 0.25) {
                alerts.push(`📐 Poor CLS: ${metric.value} (should be < 0.1)`);
            }
        }

        // Long tasks
        if (metric.type === 'responsiveness' && metric.name === 'long_task' && metric.value > 50) {
            alerts.push(`⏱️ Long Task: ${metric.value}ms (blocks main thread)`);
        }

        // Resource loading
        if (metric.type === 'resource' && metric.value > 3000) {
            alerts.push(`📦 Slow Resource: ${metric.details?.name} took ${metric.value}ms`);
        }

        // Show alerts
        alerts.forEach(alert => {
            console.warn(alert);
            this.showPerformanceAlert(alert);
        });
    }

    // Show performance alert to user
    showPerformanceAlert(message) {
        // Could integrate with notification system
        if (typeof showNotification === 'function') {
            showNotification('Performance Alert', message, {
                icon: '⚡',
                tag: 'performance'
            });
        }
    }

    // Measure custom operations
    measureOperation(name, operation) {
        const startMark = `${name}-start`;
        const endMark = `${name}-end`;
        const measureName = `${name}-duration`;

        performance.mark(startMark);
        
        const result = operation();
        
        performance.mark(endMark);
        performance.measure(measureName, startMark, endMark);
        
        return result;
    }

    // Measure async operations
    async measureAsyncOperation(name, asyncOperation) {
        const startTime = performance.now();
        
        try {
            const result = await asyncOperation();
            const duration = performance.now() - startTime;
            
            this.recordMetric({
                type: 'async_operation',
                name: name,
                value: duration,
                timestamp: Date.now(),
                status: 'success'
            });
            
            return result;
        } catch (error) {
            const duration = performance.now() - startTime;
            
            this.recordMetric({
                type: 'async_operation',
                name: name,
                value: duration,
                timestamp: Date.now(),
                status: 'error',
                error: error.message
            });
            
            throw error;
        }
    }

    // Get performance summary
    getPerformanceSummary() {
        const summary = {
            total_metrics: this.metrics.length,
            session_duration: performance.now() - this.startTime,
            core_web_vitals: {},
            resource_performance: {},
            user_interactions: {}
        };

        // Aggregate metrics by type
        this.metrics.forEach(metric => {
            if (metric.type === 'core_web_vital') {
                summary.core_web_vitals[metric.name] = metric.value;
            }
        });

        return summary;
    }

    // Start periodic collection
    startPeriodicCollection() {
        setInterval(() => {
            this.collectMemoryMetrics();
            this.collectRuntimeMetrics();
        }, 30000); // Every 30 seconds
    }

    // Collect memory metrics
    collectMemoryMetrics() {
        if ('memory' in performance) {
            const memory = performance.memory;
            
            this.recordMetric({
                type: 'memory',
                name: 'heap_used',
                value: memory.usedJSHeapSize,
                timestamp: Date.now(),
                details: {
                    total: memory.totalJSHeapSize,
                    limit: memory.jsHeapSizeLimit
                }
            });
        }
    }

    // Collect runtime metrics
    collectRuntimeMetrics() {
        this.recordMetric({
            type: 'runtime',
            name: 'session_duration',
            value: performance.now() - this.startTime,
            timestamp: Date.now()
        });

        this.recordMetric({
            type: 'runtime',
            name: 'metrics_collected',
            value: this.metrics.length,
            timestamp: Date.now()
        });
    }

    // Utility functions
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    getSessionId() {
        if (!sessionStorage.getItem('performance_session_id')) {
            sessionStorage.setItem('performance_session_id', this.generateId());
        }
        return sessionStorage.getItem('performance_session_id');
    }

    getConnectionInfo() {
        if ('connection' in navigator) {
            return {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt
            };
        }
        return null;
    }

    // Cleanup
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
        this.metrics = [];
    }
}

// Global performance monitor
window.performanceMonitor = new PerformanceMonitor();

// Convenience functions
window.measureOperation = (name, operation) => {
    return performanceMonitor.measureOperation(name, operation);
};

window.measureAsyncOperation = (name, asyncOperation) => {
    return performanceMonitor.measureAsyncOperation(name, asyncOperation);
};

window.getPerformanceSummary = () => {
    return performanceMonitor.getPerformanceSummary();
};

console.log('📊 Performance Monitor loaded - tracking Core Web Vitals and custom metrics');