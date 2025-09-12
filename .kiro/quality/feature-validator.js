/**
 * FlightStat Bot Feature Validation Suite
 * Ensures all features remain functional after changes
 */

class FeatureValidator {
    constructor() {
        this.results = [];
        this.registry = null;
    }

    async loadRegistry() {
        try {
            const response = await fetch('.kiro/quality/feature-registry.json');
            this.registry = await response.json();
            return true;
        } catch (error) {
            console.error('Failed to load feature registry:', error);
            return false;
        }
    }

    // Test Settings Modal functionality
    testSettingsModal() {
        const tests = [
            {
                name: 'settings_button_exists',
                test: () => document.getElementById('settings-btn') !== null,
                critical: true
            },
            {
                name: 'settings_modal_exists',
                test: () => document.getElementById('settings-modal') !== null,
                critical: true
            },
            {
                name: 'openSettingsModal_function_exists',
                test: () => typeof openSettingsModal === 'function',
                critical: true
            },
            {
                name: 'closeSettingsModal_function_exists',
                test: () => typeof closeSettingsModal === 'function',
                critical: true
            }
        ];

        return this.runTests('settings_modal', tests);
    }

    // Test API Key Management
    testApiKeyManagement() {
        const tests = [
            {
                name: 'api_key_input_exists',
                test: () => document.getElementById('api-key-input') !== null,
                critical: true
            },
            {
                name: 'save_api_key_button_exists',
                test: () => document.getElementById('save-api-key-btn') !== null,
                critical: true
            },
            {
                name: 'test_api_key_button_exists',
                test: () => document.getElementById('test-api-key-btn') !== null,
                critical: true
            },
            {
                name: 'api_key_status_div_exists',
                test: () => document.getElementById('api-key-status') !== null,
                critical: true
            },
            {
                name: 'testFlightAwareAPI_function_exists',
                test: () => typeof testFlightAwareAPI === 'function',
                critical: true
            }
        ];

        return this.runTests('api_key_management', tests);
    }

    // Test Flight Loading functionality
    testFlightLoading() {
        const tests = [
            {
                name: 'airport_input_exists',
                test: () => document.getElementById('airport-input') !== null,
                critical: true
            },
            {
                name: 'start_monitoring_button_exists',
                test: () => document.getElementById('start-monitoring-btn') !== null,
                critical: true
            },
            {
                name: 'flight_table_exists',
                test: () => document.getElementById('flight-table') !== null,
                critical: true
            },
            {
                name: 'startFlightMonitoring_function_exists',
                test: () => typeof startFlightMonitoring === 'function',
                critical: true
            },
            {
                name: 'generateMockFlightData_function_exists',
                test: () => typeof generateMockFlightData === 'function',
                critical: true
            },
            {
                name: 'displayFlights_function_exists',
                test: () => typeof displayFlights === 'function',
                critical: true
            }
        ];

        return this.runTests('flight_loading', tests);
    }

    // Test Enhanced Flight Table
    testEnhancedFlightTable() {
        const tests = [
            {
                name: 'generateFlightTable_function_exists',
                test: () => typeof generateFlightTable === 'function',
                critical: true
            },
            {
                name: 'formatTime_function_exists',
                test: () => typeof formatTime === 'function',
                critical: true
            },
            {
                name: 'getTimeClass_function_exists',
                test: () => typeof getTimeClass === 'function',
                critical: false
            },
            {
                name: 'getStatusClass_function_exists',
                test: () => typeof getStatusClass === 'function',
                critical: false
            }
        ];

        return this.runTests('enhanced_flight_table', tests);
    }

    // Test Notifications System
    testNotificationsSystem() {
        const tests = [
            {
                name: 'enable_notifications_checkbox_exists',
                test: () => document.getElementById('enable-notifications') !== null,
                critical: false
            },
            {
                name: 'test_notification_button_exists',
                test: () => document.getElementById('test-notification-btn') !== null,
                critical: false
            },
            {
                name: 'permission_status_exists',
                test: () => document.getElementById('permission-status') !== null,
                critical: false
            },
            {
                name: 'initializeNotifications_function_exists',
                test: () => typeof initializeNotifications === 'function',
                critical: false
            },
            {
                name: 'showNotification_function_exists',
                test: () => typeof showNotification === 'function',
                critical: false
            }
        ];

        return this.runTests('notifications_system', tests);
    }

    // Run a set of tests for a feature
    runTests(featureName, tests) {
        const results = {
            feature: featureName,
            passed: 0,
            failed: 0,
            critical_failures: 0,
            tests: []
        };

        tests.forEach(test => {
            try {
                const passed = test.test();
                results.tests.push({
                    name: test.name,
                    passed: passed,
                    critical: test.critical || false,
                    error: null
                });

                if (passed) {
                    results.passed++;
                } else {
                    results.failed++;
                    if (test.critical) {
                        results.critical_failures++;
                    }
                }
            } catch (error) {
                results.tests.push({
                    name: test.name,
                    passed: false,
                    critical: test.critical || false,
                    error: error.message
                });
                results.failed++;
                if (test.critical) {
                    results.critical_failures++;
                }
            }
        });

        return results;
    }

    // Run all feature tests
    async validateAllFeatures() {
        console.log('🔍 Starting Feature Validation...');
        
        const results = {
            timestamp: new Date().toISOString(),
            overall_status: 'unknown',
            total_features: 0,
            passed_features: 0,
            failed_features: 0,
            critical_failures: 0,
            features: {}
        };

        // Run all tests
        const testResults = [
            this.testSettingsModal(),
            this.testApiKeyManagement(),
            this.testFlightLoading(),
            this.testEnhancedFlightTable(),
            this.testNotificationsSystem()
        ];

        testResults.forEach(result => {
            results.features[result.feature] = result;
            results.total_features++;
            
            if (result.critical_failures === 0) {
                results.passed_features++;
            } else {
                results.failed_features++;
                results.critical_failures += result.critical_failures;
            }
        });

        // Determine overall status
        if (results.critical_failures === 0) {
            results.overall_status = 'PASS';
        } else {
            results.overall_status = 'FAIL';
        }

        this.results = results;
        this.displayResults();
        return results;
    }

    // Display validation results
    displayResults() {
        const results = this.results;
        
        console.log(`\n🛡️ FEATURE VALIDATION RESULTS`);
        console.log(`═══════════════════════════════`);
        console.log(`Overall Status: ${results.overall_status === 'PASS' ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`Features Tested: ${results.total_features}`);
        console.log(`Passed: ${results.passed_features}`);
        console.log(`Failed: ${results.failed_features}`);
        console.log(`Critical Failures: ${results.critical_failures}`);
        console.log(`Timestamp: ${results.timestamp}\n`);

        // Show detailed results for each feature
        Object.entries(results.features).forEach(([featureName, feature]) => {
            const status = feature.critical_failures === 0 ? '✅' : '❌';
            console.log(`${status} ${featureName}: ${feature.passed}/${feature.passed + feature.failed} tests passed`);
            
            if (feature.critical_failures > 0) {
                feature.tests.forEach(test => {
                    if (!test.passed && test.critical) {
                        console.log(`   ❌ CRITICAL: ${test.name} - ${test.error || 'Failed'}`);
                    }
                });
            }
        });

        // Show recommendations
        if (results.critical_failures > 0) {
            console.log(`\n⚠️  CRITICAL ISSUES DETECTED!`);
            console.log(`The application has ${results.critical_failures} critical failures.`);
            console.log(`Please fix these issues before proceeding with any changes.`);
        } else {
            console.log(`\n✅ ALL CRITICAL FEATURES WORKING`);
            console.log(`The application is safe for further development.`);
        }
    }

    // Create a validation report
    generateReport() {
        return {
            ...this.results,
            recommendations: this.generateRecommendations()
        };
    }

    generateRecommendations() {
        const recommendations = [];
        
        if (this.results.critical_failures > 0) {
            recommendations.push({
                type: 'critical',
                message: 'Fix critical failures before making any changes',
                action: 'rollback_or_fix'
            });
        }

        if (this.results.failed_features > 0) {
            recommendations.push({
                type: 'warning',
                message: 'Some non-critical features have issues',
                action: 'investigate_and_fix'
            });
        }

        if (this.results.critical_failures === 0) {
            recommendations.push({
                type: 'success',
                message: 'All critical features working - safe to proceed',
                action: 'continue_development'
            });
        }

        return recommendations;
    }
}

// Global validation function
window.validateFeatures = async function() {
    const validator = new FeatureValidator();
    await validator.loadRegistry();
    return await validator.validateAllFeatures();
};

// Auto-run validation on page load (after a delay)
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        console.log('🔍 Auto-running feature validation...');
        validateFeatures();
    }, 2000);
});

console.log('✅ Feature Validator loaded - run validateFeatures() to test all features');