/**
 * Continuous Background Monitoring System
 * Runs automated checks every few minutes
 */

class ContinuousMonitor {
    constructor() {
        this.isRunning = false;
        this.intervals = {};
        this.config = {
            featureValidation: 5 * 60 * 1000,    // Every 5 minutes
            performanceCheck: 2 * 60 * 1000,     // Every 2 minutes
            uxAnalysis: 10 * 60 * 1000,          // Every 10 minutes
            healthCheck: 1 * 60 * 1000,          // Every 1 minute
            qualityGate: 15 * 60 * 1000          // Every 15 minutes
        };
    }

    start() {
        if (this.isRunning) {
            console.log('🤖 Continuous Monitor already running');
            return;
        }

        console.log('🚀 Starting Continuous Background Monitor');
        console.log('═══════════════════════════════════════');
        
        this.isRunning = true;

        // Feature Validation Loop
        this.intervals.features = setInterval(async () => {
            console.log('🔍 [AUTO] Running feature validation...');
            try {
                const results = await validateFeatures();
                if (results.critical_failures > 0) {
                    this.handleCriticalFailure('Feature validation failed', results);
                }
            } catch (error) {
                console.error('🚨 [AUTO] Feature validation error:', error);
            }
        }, this.config.featureValidation);

        // Performance Monitoring Loop
        this.intervals.performance = setInterval(() => {
            console.log('📊 [AUTO] Collecting performance metrics...');
            try {
                const summary = getPerformanceSummary();
                this.analyzePerformance(summary);
            } catch (error) {
                console.error('🚨 [AUTO] Performance monitoring error:', error);
            }
        }, this.config.performanceCheck);

        // UX Analysis Loop
        this.intervals.ux = setInterval(() => {
            console.log('👤 [AUTO] Analyzing user experience...');
            try {
                const uxReport = getUXReport();
                this.analyzeUX(uxReport);
            } catch (error) {
                console.error('🚨 [AUTO] UX analysis error:', error);
            }
        }, this.config.uxAnalysis);

        // Health Check Loop
        this.intervals.health = setInterval(() => {
            this.performHealthCheck();
        }, this.config.healthCheck);

        // Quality Gate Loop
        this.intervals.quality = setInterval(async () => {
            console.log('🚪 [AUTO] Running quality gates...');
            try {
                await this.runAutomaticQualityGate();
            } catch (error) {
                console.error('🚨 [AUTO] Quality gate error:', error);
            }
        }, this.config.qualityGate);

        console.log('✅ All monitoring loops started');
        this.logMonitoringStatus();
    }

    stop() {
        if (!this.isRunning) {
            console.log('🤖 Continuous Monitor not running');
            return;
        }

        console.log('🛑 Stopping Continuous Monitor...');
        
        Object.keys(this.intervals).forEach(key => {
            clearInterval(this.intervals[key]);
            delete this.intervals[key];
        });

        this.isRunning = false;
        console.log('✅ Continuous Monitor stopped');
    }

    performHealthCheck() {
        const health = {
            timestamp: Date.now(),
            memory: this.checkMemoryUsage(),
            dom: this.checkDOMHealth(),
            events: this.checkEventListeners(),
            storage: this.checkStorageHealth()
        };

        // Log health issues
        if (health.memory.warning || health.dom.warning || health.storage.warning) {
            console.warn('⚠️ [AUTO] Health check warnings detected:', health);
        }

        return health;
    }

    checkMemoryUsage() {
        if ('memory' in performance) {
            const memory = performance.memory;
            const usedMB = memory.usedJSHeapSize / 1024 / 1024;
            const totalMB = memory.totalJSHeapSize / 1024 / 1024;
            const limitMB = memory.jsHeapSizeLimit / 1024 / 1024;

            const usage = (usedMB / limitMB) * 100;
            
            return {
                used: usedMB.toFixed(2),
                total: totalMB.toFixed(2),
                limit: limitMB.toFixed(2),
                usage_percent: usage.toFixed(1),
                warning: usage > 80
            };
        }
        return { available: false };
    }

    checkDOMHealth() {
        const elementCount = document.querySelectorAll('*').length;
        const eventListenerCount = this.estimateEventListeners();
        
        return {
            element_count: elementCount,
            event_listeners: eventListenerCount,
            warning: elementCount > 5000 || eventListenerCount > 1000
        };
    }

    checkEventListeners() {
        // Estimate event listeners (simplified)
        const buttons = document.querySelectorAll('button').length;
        const inputs = document.querySelectorAll('input').length;
        const estimated = buttons + inputs + 10; // Base listeners

        return {
            estimated_count: estimated,
            warning: estimated > 100
        };
    }

    checkStorageHealth() {
        try {
            const localStorageSize = JSON.stringify(localStorage).length;
            const sessionStorageSize = JSON.stringify(sessionStorage).length;
            
            return {
                localStorage_size: localStorageSize,
                sessionStorage_size: sessionStorageSize,
                warning: localStorageSize > 1024 * 1024 // 1MB warning
            };
        } catch (error) {
            return {
                error: error.message,
                warning: true
            };
        }
    }

    estimateEventListeners() {
        // Simple estimation based on interactive elements
        const interactive = document.querySelectorAll('button, input, select, textarea, [onclick]');
        return interactive.length * 2; // Estimate 2 listeners per element
    }

    analyzePerformance(summary) {
        // Check for performance degradation
        if (summary.session_duration > 30 * 60 * 1000) { // 30 minutes
            console.log('📊 [AUTO] Long session detected - monitoring memory usage');
        }

        // Auto-optimize if needed
        if (this.shouldOptimize(summary)) {
            this.performAutoOptimization();
        }
    }

    analyzeUX(uxReport) {
        // Check satisfaction score
        if (uxReport.satisfaction_indicators.satisfaction_score < 70) {
            console.warn('👤 [AUTO] Low satisfaction score detected:', uxReport.satisfaction_indicators.satisfaction_score);
            this.suggestUXImprovements(uxReport);
        }

        // Check for user flow issues
        if (uxReport.user_flow.completion_rate < 50) {
            console.warn('👤 [AUTO] Low flow completion rate:', uxReport.user_flow.completion_rate + '%');
        }
    }

    shouldOptimize(summary) {
        // Simple optimization triggers
        return summary.total_metrics > 1000 || 
               (summary.session_duration > 20 * 60 * 1000 && summary.total_metrics > 500);
    }

    performAutoOptimization() {
        console.log('🔧 [AUTO] Performing automatic optimization...');
        
        // Clear old metrics
        if (window.performanceMonitor && window.performanceMonitor.metrics) {
            const oldCount = window.performanceMonitor.metrics.length;
            window.performanceMonitor.metrics = window.performanceMonitor.metrics.slice(-100); // Keep last 100
            console.log(`🔧 [AUTO] Cleared ${oldCount - 100} old performance metrics`);
        }

        // Clear old UX events
        if (window.uxTracker && window.uxTracker.interactions) {
            const oldCount = window.uxTracker.interactions.length;
            window.uxTracker.interactions = window.uxTracker.interactions.slice(-200); // Keep last 200
            console.log(`🔧 [AUTO] Cleared ${oldCount - 200} old UX interactions`);
        }

        // Garbage collection hint
        if (window.gc) {
            window.gc();
            console.log('🔧 [AUTO] Triggered garbage collection');
        }
    }

    suggestUXImprovements(uxReport) {
        const suggestions = [];

        if (uxReport.engagement.errors > 0) {
            suggestions.push('Reduce JavaScript errors to improve user experience');
        }

        if (uxReport.engagement.interactions_per_minute < 1) {
            suggestions.push('Interface might be confusing - consider UX improvements');
        }

        if (uxReport.user_flow.drop_off_point !== 'completed') {
            suggestions.push(`Users dropping off at: ${uxReport.user_flow.drop_off_point}`);
        }

        console.log('💡 [AUTO] UX Improvement Suggestions:', suggestions);
    }

    async runAutomaticQualityGate() {
        // Take a quality snapshot
        const snapshot = await qualityGates.takeSnapshot('auto-check');
        
        // Check for degradation compared to last hour
        const lastHourSnapshot = this.getLastHourSnapshot();
        
        if (lastHourSnapshot && this.detectDegradation(lastHourSnapshot, snapshot)) {
            console.warn('🚨 [AUTO] Quality degradation detected!');
            this.handleQualityDegradation(lastHourSnapshot, snapshot);
        }

        // Store snapshot for future comparison
        this.storeSnapshot(snapshot);
    }

    handleCriticalFailure(reason, details) {
        console.error('🚨 [AUTO] CRITICAL FAILURE DETECTED:', reason);
        console.error('Details:', details);

        // Auto-rollback if configured
        if (this.shouldAutoRollback(details)) {
            console.log('🔄 [AUTO] Initiating automatic rollback...');
            autoRollback().then(result => {
                if (result.success) {
                    console.log('✅ [AUTO] Automatic rollback successful');
                } else {
                    console.error('❌ [AUTO] Automatic rollback failed');
                }
            });
        }

        // Send notification if available
        if (typeof showNotification === 'function') {
            showNotification('Critical System Failure', reason, {
                icon: '🚨',
                requireInteraction: true
            });
        }
    }

    shouldAutoRollback(details) {
        // Auto-rollback criteria
        return details.critical_failures > 2 || 
               (details.critical_failures > 0 && details.passed_features < 3);
    }

    detectDegradation(oldSnapshot, newSnapshot) {
        return newSnapshot.critical_failures > oldSnapshot.critical_failures ||
               newSnapshot.passed_features < oldSnapshot.passed_features;
    }

    handleQualityDegradation(oldSnapshot, newSnapshot) {
        console.warn('📉 [AUTO] Quality degradation details:');
        console.warn('Old:', oldSnapshot);
        console.warn('New:', newSnapshot);
    }

    storeSnapshot(snapshot) {
        const key = `quality_snapshot_${Date.now()}`;
        try {
            localStorage.setItem(key, JSON.stringify(snapshot));
            
            // Clean old snapshots (keep last 24 hours)
            this.cleanOldSnapshots();
        } catch (error) {
            console.warn('Failed to store quality snapshot:', error);
        }
    }

    getLastHourSnapshot() {
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('quality_snapshot_')) {
                const timestamp = parseInt(key.split('_')[2]);
                if (timestamp > oneHourAgo) {
                    try {
                        return JSON.parse(localStorage.getItem(key));
                    } catch (error) {
                        continue;
                    }
                }
            }
        }
        return null;
    }

    cleanOldSnapshots() {
        const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
        const keysToDelete = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('quality_snapshot_')) {
                const timestamp = parseInt(key.split('_')[2]);
                if (timestamp < oneDayAgo) {
                    keysToDelete.push(key);
                }
            }
        }
        
        keysToDelete.forEach(key => localStorage.removeItem(key));
        
        if (keysToDelete.length > 0) {
            console.log(`🧹 [AUTO] Cleaned ${keysToDelete.length} old quality snapshots`);
        }
    }

    logMonitoringStatus() {
        console.log('\n🤖 Continuous Monitor Status:');
        console.log('═══════════════════════════════');
        console.log('✅ Feature Validation: Every 5 minutes');
        console.log('✅ Performance Check: Every 2 minutes');
        console.log('✅ UX Analysis: Every 10 minutes');
        console.log('✅ Health Check: Every 1 minute');
        console.log('✅ Quality Gate: Every 15 minutes');
        console.log('\nUse continuousMonitor.stop() to stop monitoring');
    }

    getStatus() {
        return {
            running: this.isRunning,
            active_intervals: Object.keys(this.intervals).length,
            config: this.config,
            uptime: this.isRunning ? Date.now() - this.startTime : 0
        };
    }
}

// Global continuous monitor
window.continuousMonitor = new ContinuousMonitor();

// Auto-start monitoring
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        console.log('🤖 Auto-starting Continuous Monitor...');
        continuousMonitor.start();
    }, 5000); // Start after 5 seconds
});

// Convenience functions
window.startContinuousMonitoring = () => continuousMonitor.start();
window.stopContinuousMonitoring = () => continuousMonitor.stop();
window.getMonitoringStatus = () => continuousMonitor.getStatus();

console.log('🤖 Continuous Monitor loaded - will auto-start in 5 seconds');