/**
 * User Experience Tracking System
 * Tracks user interactions, journeys, and satisfaction metrics
 */

class UXTracker {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.userId = this.getUserId();
        this.interactions = [];
        this.journey = [];
        this.startTime = Date.now();
        this.init();
    }

    init() {
        this.trackPageLoad();
        this.trackClicks();
        this.trackFormInteractions();
        this.trackScrollBehavior();
        this.trackTimeOnPage();
        this.trackErrors();
        this.trackFeatureUsage();
        this.trackUserFlow();
    }

    // Track page load and initial state
    trackPageLoad() {
        this.recordEvent({
            type: 'page_load',
            action: 'app_started',
            timestamp: Date.now(),
            data: {
                user_agent: navigator.userAgent,
                screen_resolution: `${screen.width}x${screen.height}`,
                viewport: `${window.innerWidth}x${window.innerHeight}`,
                language: navigator.language,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            }
        });
    }

    // Track all click interactions
    trackClicks() {
        document.addEventListener('click', (event) => {
            const element = event.target;
            const elementInfo = this.getElementInfo(element);
            
            this.recordEvent({
                type: 'interaction',
                action: 'click',
                timestamp: Date.now(),
                data: {
                    element: elementInfo,
                    coordinates: { x: event.clientX, y: event.clientY },
                    modifier_keys: {
                        ctrl: event.ctrlKey,
                        shift: event.shiftKey,
                        alt: event.altKey
                    }
                }
            });

            // Track specific feature usage
            this.trackFeatureClick(element);
        });
    }

    // Track form interactions
    trackFormInteractions() {
        // Track input focus
        document.addEventListener('focusin', (event) => {
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                this.recordEvent({
                    type: 'form_interaction',
                    action: 'input_focus',
                    timestamp: Date.now(),
                    data: {
                        input_id: event.target.id,
                        input_type: event.target.type,
                        placeholder: event.target.placeholder
                    }
                });
            }
        });

        // Track input changes
        document.addEventListener('input', (event) => {
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                this.recordEvent({
                    type: 'form_interaction',
                    action: 'input_change',
                    timestamp: Date.now(),
                    data: {
                        input_id: event.target.id,
                        value_length: event.target.value.length,
                        is_empty: event.target.value.length === 0
                    }
                });
            }
        });

        // Track form submissions
        document.addEventListener('submit', (event) => {
            this.recordEvent({
                type: 'form_interaction',
                action: 'form_submit',
                timestamp: Date.now(),
                data: {
                    form_id: event.target.id,
                    form_elements: Array.from(event.target.elements).length
                }
            });
        });
    }

    // Track scroll behavior
    trackScrollBehavior() {
        let scrollTimeout;
        let maxScroll = 0;

        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            maxScroll = Math.max(maxScroll, scrollPercent);

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.recordEvent({
                    type: 'scroll_behavior',
                    action: 'scroll_stop',
                    timestamp: Date.now(),
                    data: {
                        scroll_percent: scrollPercent,
                        max_scroll: maxScroll,
                        scroll_position: window.scrollY
                    }
                });
            }, 150);
        });
    }

    // Track time spent on different sections
    trackTimeOnPage() {
        // Track visibility changes
        document.addEventListener('visibilitychange', () => {
            this.recordEvent({
                type: 'engagement',
                action: document.hidden ? 'page_hidden' : 'page_visible',
                timestamp: Date.now(),
                data: {
                    session_duration: Date.now() - this.startTime
                }
            });
        });

        // Track before unload
        window.addEventListener('beforeunload', () => {
            this.recordEvent({
                type: 'engagement',
                action: 'page_exit',
                timestamp: Date.now(),
                data: {
                    total_session_time: Date.now() - this.startTime,
                    total_interactions: this.interactions.length
                }
            });
            
            this.flushEvents();
        });
    }

    // Track JavaScript errors that affect UX
    trackErrors() {
        window.addEventListener('error', (event) => {
            this.recordEvent({
                type: 'error',
                action: 'javascript_error',
                timestamp: Date.now(),
                data: {
                    message: event.message,
                    filename: event.filename,
                    line: event.lineno,
                    column: event.colno,
                    stack: event.error?.stack
                }
            });
        });

        // Track unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.recordEvent({
                type: 'error',
                action: 'unhandled_promise_rejection',
                timestamp: Date.now(),
                data: {
                    reason: event.reason?.toString(),
                    stack: event.reason?.stack
                }
            });
        });
    }

    // Track specific feature usage
    trackFeatureUsage() {
        // Track modal openings
        const originalOpenSettings = window.openSettingsModal;
        if (originalOpenSettings) {
            window.openSettingsModal = () => {
                this.recordEvent({
                    type: 'feature_usage',
                    action: 'settings_modal_opened',
                    timestamp: Date.now()
                });
                return originalOpenSettings();
            };
        }

        // Track API key operations
        this.trackAPIKeyUsage();
        
        // Track flight loading
        this.trackFlightLoading();
    }

    // Track API key related interactions
    trackAPIKeyUsage() {
        // Monitor API key save attempts
        const saveButton = document.getElementById('save-api-key-btn');
        if (saveButton) {
            saveButton.addEventListener('click', () => {
                this.recordEvent({
                    type: 'feature_usage',
                    action: 'api_key_save_attempt',
                    timestamp: Date.now()
                });
            });
        }

        // Monitor API key test attempts
        const testButton = document.getElementById('test-api-key-btn');
        if (testButton) {
            testButton.addEventListener('click', () => {
                this.recordEvent({
                    type: 'feature_usage',
                    action: 'api_key_test_attempt',
                    timestamp: Date.now()
                });
            });
        }
    }

    // Track flight loading behavior
    trackFlightLoading() {
        const airportInput = document.getElementById('airport-input');
        if (airportInput) {
            airportInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    this.recordEvent({
                        type: 'feature_usage',
                        action: 'flight_search_enter_key',
                        timestamp: Date.now(),
                        data: {
                            airport_code: event.target.value.trim().toUpperCase()
                        }
                    });
                }
            });
        }

        const loadButton = document.getElementById('start-monitoring-btn');
        if (loadButton) {
            loadButton.addEventListener('click', () => {
                this.recordEvent({
                    type: 'feature_usage',
                    action: 'flight_search_button_click',
                    timestamp: Date.now()
                });
            });
        }
    }

    // Track user flow and journey
    trackUserFlow() {
        // Define key user actions that represent flow steps
        const flowSteps = {
            'app_started': 'onboarding',
            'settings_modal_opened': 'configuration',
            'api_key_save_attempt': 'setup',
            'flight_search_attempt': 'usage',
            'flight_data_displayed': 'success'
        };

        // Monitor for flow progression
        this.interactions.forEach(interaction => {
            if (flowSteps[interaction.action]) {
                this.journey.push({
                    step: flowSteps[interaction.action],
                    timestamp: interaction.timestamp,
                    action: interaction.action
                });
            }
        });
    }

    // Track feature clicks for specific elements
    trackFeatureClick(element) {
        const featureMap = {
            'settings-btn': 'settings_access',
            'save-api-key-btn': 'api_key_save',
            'test-api-key-btn': 'api_key_test',
            'start-monitoring-btn': 'flight_monitoring',
            'import-clipboard-btn': 'data_import',
            'export-data-btn': 'data_export'
        };

        if (element.id && featureMap[element.id]) {
            this.recordEvent({
                type: 'feature_usage',
                action: featureMap[element.id],
                timestamp: Date.now(),
                data: {
                    feature_id: element.id,
                    feature_name: featureMap[element.id]
                }
            });
        }
    }

    // Record an event
    recordEvent(event) {
        const enrichedEvent = {
            ...event,
            id: this.generateId(),
            session_id: this.sessionId,
            user_id: this.userId,
            sequence_number: this.interactions.length + 1
        };

        this.interactions.push(enrichedEvent);
        
        // Store in SQLite if available
        this.storeEventInDB(enrichedEvent);
        
        // Update user journey
        this.updateJourney(enrichedEvent);
    }

    // Store event in database
    async storeEventInDB(event) {
        try {
            console.log('👤 UX Event:', event);
            
            // In real implementation, this would use SQLite MCP:
            // await mcp_sqlite_write_query(`
            //     INSERT INTO ux_events 
            //     (session_id, user_id, type, action, timestamp, data) 
            //     VALUES (?, ?, ?, ?, ?, ?)
            // `, [event.session_id, event.user_id, event.type, event.action, event.timestamp, JSON.stringify(event.data)]);
            
        } catch (error) {
            console.error('Failed to store UX event:', error);
        }
    }

    // Update user journey
    updateJourney(event) {
        // Add to journey if it's a significant action
        const significantActions = [
            'app_started', 'settings_modal_opened', 'api_key_save_attempt', 
            'flight_search_attempt', 'error_occurred', 'page_exit'
        ];

        if (significantActions.includes(event.action)) {
            this.journey.push({
                step: event.action,
                timestamp: event.timestamp,
                type: event.type
            });
        }
    }

    // Get element information for tracking
    getElementInfo(element) {
        return {
            tag: element.tagName,
            id: element.id,
            class: element.className,
            text: element.textContent?.substring(0, 50),
            type: element.type,
            name: element.name
        };
    }

    // Generate analytics report
    generateUXReport() {
        const sessionDuration = Date.now() - this.startTime;
        const clickEvents = this.interactions.filter(i => i.type === 'interaction' && i.action === 'click');
        const formEvents = this.interactions.filter(i => i.type === 'form_interaction');
        const featureEvents = this.interactions.filter(i => i.type === 'feature_usage');
        const errorEvents = this.interactions.filter(i => i.type === 'error');

        return {
            session: {
                id: this.sessionId,
                user_id: this.userId,
                duration: sessionDuration,
                start_time: this.startTime,
                end_time: Date.now()
            },
            engagement: {
                total_interactions: this.interactions.length,
                clicks: clickEvents.length,
                form_interactions: formEvents.length,
                feature_usage: featureEvents.length,
                errors: errorEvents.length,
                interactions_per_minute: (this.interactions.length / (sessionDuration / 60000)).toFixed(2)
            },
            journey: this.journey,
            top_features: this.getTopFeatures(),
            user_flow: this.analyzeUserFlow(),
            satisfaction_indicators: this.calculateSatisfactionIndicators()
        };
    }

    // Get most used features
    getTopFeatures() {
        const featureUsage = {};
        
        this.interactions
            .filter(i => i.type === 'feature_usage')
            .forEach(i => {
                featureUsage[i.action] = (featureUsage[i.action] || 0) + 1;
            });

        return Object.entries(featureUsage)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);
    }

    // Analyze user flow completion
    analyzeUserFlow() {
        const expectedFlow = ['app_started', 'settings_modal_opened', 'api_key_save_attempt', 'flight_search_attempt'];
        const userActions = this.journey.map(j => j.step);
        
        const completedSteps = expectedFlow.filter(step => userActions.includes(step));
        const completionRate = (completedSteps.length / expectedFlow.length) * 100;

        return {
            expected_flow: expectedFlow,
            completed_steps: completedSteps,
            completion_rate: completionRate,
            drop_off_point: expectedFlow.find(step => !userActions.includes(step)) || 'completed'
        };
    }

    // Calculate satisfaction indicators
    calculateSatisfactionIndicators() {
        const sessionDuration = Date.now() - this.startTime;
        const errorCount = this.interactions.filter(i => i.type === 'error').length;
        const featureUsage = this.interactions.filter(i => i.type === 'feature_usage').length;
        
        // Simple satisfaction scoring
        let score = 100;
        
        // Deduct for errors
        score -= errorCount * 20;
        
        // Deduct for very short sessions (< 30 seconds)
        if (sessionDuration < 30000) score -= 30;
        
        // Add for feature usage
        score += Math.min(featureUsage * 5, 30);
        
        // Ensure score is between 0-100
        score = Math.max(0, Math.min(100, score));

        return {
            satisfaction_score: score,
            factors: {
                session_duration: sessionDuration,
                error_count: errorCount,
                feature_usage_count: featureUsage,
                completion_rate: this.analyzeUserFlow().completion_rate
            }
        };
    }

    // Flush events to storage
    flushEvents() {
        // Send all pending events to storage
        console.log('📊 UX Session Summary:', this.generateUXReport());
    }

    // Utility functions
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    generateSessionId() {
        return 'ux_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2);
    }

    getUserId() {
        let userId = localStorage.getItem('ux_user_id');
        if (!userId) {
            userId = 'user_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2);
            localStorage.setItem('ux_user_id', userId);
        }
        return userId;
    }
}

// Global UX tracker
window.uxTracker = new UXTracker();

// Convenience functions
window.getUXReport = () => {
    return uxTracker.generateUXReport();
};

window.trackCustomEvent = (type, action, data) => {
    uxTracker.recordEvent({
        type: type,
        action: action,
        timestamp: Date.now(),
        data: data
    });
};

console.log('👤 UX Tracker loaded - monitoring user interactions and journey');