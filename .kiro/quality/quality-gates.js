/**
 * Quality Gates System
 * Prevents degradation by checking quality before and after changes
 */

class QualityGates {
    constructor() {
        this.preChangeSnapshot = null;
        this.postChangeSnapshot = null;
    }

    // Take a snapshot of current feature status
    async takeSnapshot(label = 'snapshot') {
        const validator = new FeatureValidator();
        await validator.loadRegistry();
        const results = await validator.validateAllFeatures();
        
        const snapshot = {
            timestamp: new Date().toISOString(),
            label: label,
            overall_status: results.overall_status,
            critical_failures: results.critical_failures,
            passed_features: results.passed_features,
            failed_features: results.failed_features,
            feature_details: {}
        };

        // Store detailed feature status
        Object.entries(results.features).forEach(([name, feature]) => {
            snapshot.feature_details[name] = {
                critical_failures: feature.critical_failures,
                passed: feature.passed,
                failed: feature.failed,
                status: feature.critical_failures === 0 ? 'PASS' : 'FAIL'
            };
        });

        return snapshot;
    }

    // Pre-change quality gate
    async preChangeGate() {
        console.log('🚪 PRE-CHANGE QUALITY GATE');
        console.log('═══════════════════════════');
        
        this.preChangeSnapshot = await this.takeSnapshot('pre-change');
        
        if (this.preChangeSnapshot.critical_failures > 0) {
            console.log('❌ PRE-CHANGE GATE FAILED');
            console.log(`Found ${this.preChangeSnapshot.critical_failures} critical failures`);
            console.log('Please fix existing issues before making changes');
            return false;
        }
        
        console.log('✅ PRE-CHANGE GATE PASSED');
        console.log('System is stable - safe to proceed with changes');
        return true;
    }

    // Post-change quality gate
    async postChangeGate() {
        console.log('\n🚪 POST-CHANGE QUALITY GATE');
        console.log('════════════════════════════');
        
        this.postChangeSnapshot = await this.takeSnapshot('post-change');
        
        const degradation = this.detectDegradation();
        
        if (degradation.hasDegradation) {
            console.log('❌ POST-CHANGE GATE FAILED');
            console.log('QUALITY DEGRADATION DETECTED:');
            degradation.issues.forEach(issue => {
                console.log(`  • ${issue}`);
            });
            console.log('\n🔄 AUTOMATIC ROLLBACK RECOMMENDED');
            return false;
        }
        
        console.log('✅ POST-CHANGE GATE PASSED');
        console.log('No quality degradation detected');
        return true;
    }

    // Detect if quality has degraded
    detectDegradation() {
        if (!this.preChangeSnapshot || !this.postChangeSnapshot) {
            return {
                hasDegradation: true,
                issues: ['Missing pre-change or post-change snapshot']
            };
        }

        const issues = [];

        // Check for new critical failures
        if (this.postChangeSnapshot.critical_failures > this.preChangeSnapshot.critical_failures) {
            issues.push(`Critical failures increased: ${this.preChangeSnapshot.critical_failures} → ${this.postChangeSnapshot.critical_failures}`);
        }

        // Check for decreased passed features
        if (this.postChangeSnapshot.passed_features < this.preChangeSnapshot.passed_features) {
            issues.push(`Passed features decreased: ${this.preChangeSnapshot.passed_features} → ${this.postChangeSnapshot.passed_features}`);
        }

        // Check individual feature degradation
        Object.entries(this.preChangeSnapshot.feature_details).forEach(([featureName, preFeature]) => {
            const postFeature = this.postChangeSnapshot.feature_details[featureName];
            
            if (!postFeature) {
                issues.push(`Feature removed: ${featureName}`);
                return;
            }

            if (preFeature.status === 'PASS' && postFeature.status === 'FAIL') {
                issues.push(`Feature degraded: ${featureName} (PASS → FAIL)`);
            }

            if (postFeature.critical_failures > preFeature.critical_failures) {
                issues.push(`Critical failures in ${featureName}: ${preFeature.critical_failures} → ${postFeature.critical_failures}`);
            }
        });

        return {
            hasDegradation: issues.length > 0,
            issues: issues
        };
    }

    // Generate quality report
    generateQualityReport() {
        if (!this.preChangeSnapshot || !this.postChangeSnapshot) {
            return {
                status: 'incomplete',
                message: 'Missing snapshots for comparison'
            };
        }

        const degradation = this.detectDegradation();
        
        return {
            status: degradation.hasDegradation ? 'degraded' : 'improved_or_stable',
            preChange: this.preChangeSnapshot,
            postChange: this.postChangeSnapshot,
            degradation: degradation,
            recommendation: degradation.hasDegradation ? 'rollback' : 'accept_changes',
            timestamp: new Date().toISOString()
        };
    }
}

// Global quality gate functions
window.qualityGates = new QualityGates();

window.runPreChangeGate = async function() {
    return await qualityGates.preChangeGate();
};

window.runPostChangeGate = async function() {
    return await qualityGates.postChangeGate();
};

window.getQualityReport = function() {
    return qualityGates.generateQualityReport();
};

console.log('🚪 Quality Gates System loaded');
console.log('Use: runPreChangeGate() before changes, runPostChangeGate() after changes');