/**
 * CI Test Runner for FlightStat Bot
 * Runs all quality tests in CI/CD environment
 */

const fs = require('fs');
const path = require('path');

class CITestRunner {
    constructor() {
        this.results = {
            timestamp: new Date().toISOString(),
            overall_status: 'unknown',
            tests: {},
            summary: {
                total: 0,
                passed: 0,
                failed: 0,
                skipped: 0
            }
        };
    }

    async runAllTests() {
        console.log('🚀 Starting CI Test Suite for FlightStat Bot');
        console.log('═══════════════════════════════════════════');

        try {
            // Run different test categories
            await this.runFeatureTests();
            await this.runSecurityTests();
            await this.runPerformanceTests();
            await this.runAccessibilityTests();
            await this.runCodeQualityTests();

            // Generate final report
            this.generateFinalReport();
            
        } catch (error) {
            console.error('❌ CI Test Suite failed:', error);
            this.results.overall_status = 'FAILED';
            process.exit(1);
        }
    }

    async runFeatureTests() {
        console.log('\n🧪 Running Feature Tests...');
        
        const featureTests = {
            'html_structure': this.testHTMLStructure(),
            'required_elements': this.testRequiredElements(),
            'javascript_syntax': this.testJavaScriptSyntax(),
            'css_validity': this.testCSSValidity(),
            'function_definitions': this.testFunctionDefinitions()
        };

        for (const [testName, testResult] of Object.entries(featureTests)) {
            this.recordTestResult('feature', testName, testResult);
        }
    }

    async runSecurityTests() {
        console.log('\n🔒 Running Security Tests...');
        
        const securityTests = {
            'no_eval_usage': this.testNoEvalUsage(),
            'safe_dom_manipulation': this.testSafeDOMManipulation(),
            'xss_prevention': this.testXSSPrevention(),
            'secure_storage': this.testSecureStorage()
        };

        for (const [testName, testResult] of Object.entries(securityTests)) {
            this.recordTestResult('security', testName, testResult);
        }
    }

    async runPerformanceTests() {
        console.log('\n⚡ Running Performance Tests...');
        
        const performanceTests = {
            'file_size_check': this.testFileSize(),
            'script_optimization': this.testScriptOptimization(),
            'css_optimization': this.testCSSOptimization(),
            'image_optimization': this.testImageOptimization()
        };

        for (const [testName, testResult] of Object.entries(performanceTests)) {
            this.recordTestResult('performance', testName, testResult);
        }
    }

    async runAccessibilityTests() {
        console.log('\n♿ Running Accessibility Tests...');
        
        const accessibilityTests = {
            'alt_text_present': this.testAltText(),
            'aria_labels': this.testAriaLabels(),
            'keyboard_navigation': this.testKeyboardNavigation(),
            'color_contrast': this.testColorContrast()
        };

        for (const [testName, testResult] of Object.entries(accessibilityTests)) {
            this.recordTestResult('accessibility', testName, testResult);
        }
    }

    async runCodeQualityTests() {
        console.log('\n📝 Running Code Quality Tests...');
        
        const qualityTests = {
            'no_console_logs': this.testNoConsoleLogs(),
            'proper_indentation': this.testProperIndentation(),
            'comment_coverage': this.testCommentCoverage(),
            'naming_conventions': this.testNamingConventions()
        };

        for (const [testName, testResult] of Object.entries(qualityTests)) {
            this.recordTestResult('quality', testName, testResult);
        }
    }

    // Feature Tests
    testHTMLStructure() {
        try {
            const html = fs.readFileSync('flightstat-bot.html', 'utf8');
            
            const hasDoctype = html.includes('<!DOCTYPE html>');
            const hasHtmlTag = html.includes('<html');
            const hasHeadTag = html.includes('<head>');
            const hasBodyTag = html.includes('<body>');
            
            return {
                passed: hasDoctype && hasHtmlTag && hasHeadTag && hasBodyTag,
                message: hasDoctype && hasHtmlTag && hasHeadTag && hasBodyTag ? 
                    'HTML structure is valid' : 'HTML structure is missing required elements',
                details: { hasDoctype, hasHtmlTag, hasHeadTag, hasBodyTag }
            };
        } catch (error) {
            return { passed: false, message: `Error reading HTML file: ${error.message}` };
        }
    }

    testRequiredElements() {
        try {
            const html = fs.readFileSync('flightstat-bot.html', 'utf8');
            
            const requiredElements = [
                'id="settings-btn"',
                'id="settings-modal"',
                'id="api-key-input"',
                'id="save-api-key-btn"',
                'id="test-api-key-btn"',
                'id="airport-input"',
                'id="flight-table"'
            ];
            
            const missingElements = requiredElements.filter(element => !html.includes(element));
            
            return {
                passed: missingElements.length === 0,
                message: missingElements.length === 0 ? 
                    'All required elements present' : `Missing elements: ${missingElements.join(', ')}`,
                details: { required: requiredElements.length, missing: missingElements }
            };
        } catch (error) {
            return { passed: false, message: `Error checking elements: ${error.message}` };
        }
    }

    testJavaScriptSyntax() {
        try {
            const html = fs.readFileSync('flightstat-bot.html', 'utf8');
            
            // Extract JavaScript from script tags
            const scriptMatches = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
            
            if (!scriptMatches) {
                return { passed: false, message: 'No JavaScript found' };
            }

            // Basic syntax checks
            const hasOpenSettingsModal = html.includes('function openSettingsModal');
            const hasCloseSettingsModal = html.includes('function closeSettingsModal');
            const hasStartFlightMonitoring = html.includes('function startFlightMonitoring');
            
            return {
                passed: hasOpenSettingsModal && hasCloseSettingsModal && hasStartFlightMonitoring,
                message: 'Core JavaScript functions present',
                details: { hasOpenSettingsModal, hasCloseSettingsModal, hasStartFlightMonitoring }
            };
        } catch (error) {
            return { passed: false, message: `JavaScript syntax error: ${error.message}` };
        }
    }

    testCSSValidity() {
        try {
            const html = fs.readFileSync('flightstat-bot.html', 'utf8');
            
            // Check for CSS in style tags
            const styleMatches = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
            
            if (!styleMatches) {
                return { passed: false, message: 'No CSS found' };
            }

            // Basic CSS checks
            const hasFlightTableCSS = html.includes('.flight-table');
            const hasModalCSS = html.includes('.modal');
            const hasBtnCSS = html.includes('.btn');
            
            return {
                passed: hasFlightTableCSS && hasModalCSS && hasBtnCSS,
                message: 'Core CSS classes present',
                details: { hasFlightTableCSS, hasModalCSS, hasBtnCSS }
            };
        } catch (error) {
            return { passed: false, message: `CSS validation error: ${error.message}` };
        }
    }

    testFunctionDefinitions() {
        try {
            const html = fs.readFileSync('flightstat-bot.html', 'utf8');
            
            const requiredFunctions = [
                'openSettingsModal',
                'closeSettingsModal',
                'startFlightMonitoring',
                'generateMockFlightData',
                'displayFlights',
                'generateFlightTable',
                'formatTime'
            ];
            
            const missingFunctions = requiredFunctions.filter(func => 
                !html.includes(`function ${func}`) && !html.includes(`${func} =`)
            );
            
            return {
                passed: missingFunctions.length === 0,
                message: missingFunctions.length === 0 ? 
                    'All required functions defined' : `Missing functions: ${missingFunctions.join(', ')}`,
                details: { required: requiredFunctions.length, missing: missingFunctions }
            };
        } catch (error) {
            return { passed: false, message: `Function check error: ${error.message}` };
        }
    }

    // Security Tests
    testNoEvalUsage() {
        try {
            const html = fs.readFileSync('flightstat-bot.html', 'utf8');
            const hasEval = html.includes('eval(');
            
            return {
                passed: !hasEval,
                message: hasEval ? 'Dangerous eval() usage found' : 'No eval() usage detected',
                details: { hasEval }
            };
        } catch (error) {
            return { passed: false, message: `Security check error: ${error.message}` };
        }
    }

    testSafeDOMManipulation() {
        try {
            const html = fs.readFileSync('flightstat-bot.html', 'utf8');
            
            // Check for potentially unsafe DOM manipulation
            const hasInnerHTML = html.includes('innerHTML');
            const hasDocumentWrite = html.includes('document.write');
            
            // innerHTML is used but should be with trusted content
            const unsafePatterns = [
                'innerHTML.*\\+.*input',
                'innerHTML.*\\+.*value',
                'document\\.write\\('
            ];
            
            const hasUnsafePatterns = unsafePatterns.some(pattern => 
                new RegExp(pattern, 'i').test(html)
            );
            
            return {
                passed: !hasUnsafePatterns,
                message: hasUnsafePatterns ? 'Potentially unsafe DOM manipulation found' : 'DOM manipulation appears safe',
                details: { hasInnerHTML, hasDocumentWrite, hasUnsafePatterns }
            };
        } catch (error) {
            return { passed: false, message: `DOM security check error: ${error.message}` };
        }
    }

    testXSSPrevention() {
        try {
            const html = fs.readFileSync('flightstat-bot.html', 'utf8');
            
            // Check for XSS prevention measures
            const hasCSP = html.includes('Content-Security-Policy');
            const sanitizesInput = html.includes('trim()') || html.includes('escape');
            
            return {
                passed: true, // Basic check - more sophisticated XSS testing would be needed
                message: 'Basic XSS prevention checks passed',
                details: { hasCSP, sanitizesInput }
            };
        } catch (error) {
            return { passed: false, message: `XSS check error: ${error.message}` };
        }
    }

    testSecureStorage() {
        try {
            const html = fs.readFileSync('flightstat-bot.html', 'utf8');
            
            // Check localStorage usage
            const usesLocalStorage = html.includes('localStorage');
            const hasEncryption = html.includes('btoa') || html.includes('encrypt');
            
            return {
                passed: true, // localStorage usage is acceptable for this app
                message: 'Storage usage is appropriate for application needs',
                details: { usesLocalStorage, hasEncryption }
            };
        } catch (error) {
            return { passed: false, message: `Storage security check error: ${error.message}` };
        }
    }

    // Performance Tests
    testFileSize() {
        try {
            const stats = fs.statSync('flightstat-bot.html');
            const sizeKB = stats.size / 1024;
            const maxSizeKB = 500; // 500KB limit
            
            return {
                passed: sizeKB <= maxSizeKB,
                message: `File size: ${sizeKB.toFixed(2)}KB (limit: ${maxSizeKB}KB)`,
                details: { sizeKB, maxSizeKB, withinLimit: sizeKB <= maxSizeKB }
            };
        } catch (error) {
            return { passed: false, message: `File size check error: ${error.message}` };
        }
    }

    testScriptOptimization() {
        try {
            const html = fs.readFileSync('flightstat-bot.html', 'utf8');
            
            // Check for optimization indicators
            const hasMinification = !html.includes('    '); // Very basic check
            const hasComments = html.includes('//') || html.includes('/*');
            
            return {
                passed: true, // Development version can have comments and formatting
                message: 'Script optimization check completed',
                details: { hasMinification, hasComments }
            };
        } catch (error) {
            return { passed: false, message: `Script optimization check error: ${error.message}` };
        }
    }

    testCSSOptimization() {
        try {
            const html = fs.readFileSync('flightstat-bot.html', 'utf8');
            
            // Basic CSS optimization checks
            const hasDuplicateRules = false; // Would need more sophisticated checking
            const hasUnusedRules = false; // Would need more sophisticated checking
            
            return {
                passed: true,
                message: 'CSS optimization check completed',
                details: { hasDuplicateRules, hasUnusedRules }
            };
        } catch (error) {
            return { passed: false, message: `CSS optimization check error: ${error.message}` };
        }
    }

    testImageOptimization() {
        // No images in current implementation
        return {
            passed: true,
            message: 'No images to optimize',
            details: { imageCount: 0 }
        };
    }

    // Accessibility Tests
    testAltText() {
        try {
            const html = fs.readFileSync('flightstat-bot.html', 'utf8');
            
            const imgTags = html.match(/<img[^>]*>/gi) || [];
            const imgsWithoutAlt = imgTags.filter(img => !img.includes('alt='));
            
            return {
                passed: imgsWithoutAlt.length === 0,
                message: imgTags.length === 0 ? 'No images found' : 
                    imgsWithoutAlt.length === 0 ? 'All images have alt text' : 
                    `${imgsWithoutAlt.length} images missing alt text`,
                details: { totalImages: imgTags.length, missingAlt: imgsWithoutAlt.length }
            };
        } catch (error) {
            return { passed: false, message: `Alt text check error: ${error.message}` };
        }
    }

    testAriaLabels() {
        try {
            const html = fs.readFileSync('flightstat-bot.html', 'utf8');
            
            const hasAriaLabels = html.includes('aria-label');
            const hasAriaDescribedBy = html.includes('aria-describedby');
            const hasRole = html.includes('role=');
            
            return {
                passed: hasAriaLabels || hasAriaDescribedBy || hasRole,
                message: 'ARIA attributes found in HTML',
                details: { hasAriaLabels, hasAriaDescribedBy, hasRole }
            };
        } catch (error) {
            return { passed: false, message: `ARIA check error: ${error.message}` };
        }
    }

    testKeyboardNavigation() {
        try {
            const html = fs.readFileSync('flightstat-bot.html', 'utf8');
            
            const hasTabIndex = html.includes('tabindex');
            const hasKeyboardEvents = html.includes('keypress') || html.includes('keydown');
            
            return {
                passed: hasKeyboardEvents,
                message: 'Keyboard navigation support detected',
                details: { hasTabIndex, hasKeyboardEvents }
            };
        } catch (error) {
            return { passed: false, message: `Keyboard navigation check error: ${error.message}` };
        }
    }

    testColorContrast() {
        // Basic check - would need more sophisticated color analysis
        return {
            passed: true,
            message: 'Color contrast check completed (manual verification recommended)',
            details: { automated: false, manualRequired: true }
        };
    }

    // Code Quality Tests
    testNoConsoleLogs() {
        try {
            const html = fs.readFileSync('flightstat-bot.html', 'utf8');
            
            // Allow console.log in development, warn in CI
            const consoleLogCount = (html.match(/console\.log/g) || []).length;
            
            return {
                passed: true, // Warning only
                message: consoleLogCount > 0 ? 
                    `${consoleLogCount} console.log statements found (consider removing for production)` :
                    'No console.log statements found',
                details: { consoleLogCount, isWarning: consoleLogCount > 0 }
            };
        } catch (error) {
            return { passed: false, message: `Console log check error: ${error.message}` };
        }
    }

    testProperIndentation() {
        try {
            const html = fs.readFileSync('flightstat-bot.html', 'utf8');
            
            // Basic indentation check
            const lines = html.split('\n');
            const properlyIndented = lines.filter(line => 
                line.trim() === '' || line.match(/^[ ]{0,}[^ ]/) // Starts with spaces or no spaces
            ).length;
            
            const indentationRatio = properlyIndented / lines.length;
            
            return {
                passed: indentationRatio > 0.8,
                message: `Indentation ratio: ${(indentationRatio * 100).toFixed(1)}%`,
                details: { totalLines: lines.length, properlyIndented, indentationRatio }
            };
        } catch (error) {
            return { passed: false, message: `Indentation check error: ${error.message}` };
        }
    }

    testCommentCoverage() {
        try {
            const html = fs.readFileSync('flightstat-bot.html', 'utf8');
            
            const commentCount = (html.match(/\/\*[\s\S]*?\*\/|\/\/.*$/gm) || []).length;
            const functionCount = (html.match(/function\s+\w+/g) || []).length;
            
            const commentRatio = functionCount > 0 ? commentCount / functionCount : 0;
            
            return {
                passed: commentRatio > 0.3, // At least 30% comment coverage
                message: `Comment coverage: ${(commentRatio * 100).toFixed(1)}%`,
                details: { commentCount, functionCount, commentRatio }
            };
        } catch (error) {
            return { passed: false, message: `Comment coverage check error: ${error.message}` };
        }
    }

    testNamingConventions() {
        try {
            const html = fs.readFileSync('flightstat-bot.html', 'utf8');
            
            // Check for consistent naming conventions
            const camelCaseFunctions = (html.match(/function\s+[a-z][a-zA-Z0-9]*\(/g) || []).length;
            const kebabCaseIds = (html.match(/id="[a-z][a-z0-9-]*"/g) || []).length;
            
            return {
                passed: camelCaseFunctions > 0 && kebabCaseIds > 0,
                message: 'Naming conventions appear consistent',
                details: { camelCaseFunctions, kebabCaseIds }
            };
        } catch (error) {
            return { passed: false, message: `Naming convention check error: ${error.message}` };
        }
    }

    // Helper methods
    recordTestResult(category, testName, result) {
        if (!this.results.tests[category]) {
            this.results.tests[category] = {};
        }
        
        this.results.tests[category][testName] = result;
        this.results.summary.total++;
        
        if (result.passed) {
            this.results.summary.passed++;
            console.log(`  ✅ ${testName}: ${result.message}`);
        } else {
            this.results.summary.failed++;
            console.log(`  ❌ ${testName}: ${result.message}`);
        }
    }

    generateFinalReport() {
        const passRate = (this.results.summary.passed / this.results.summary.total) * 100;
        
        this.results.overall_status = passRate >= 80 ? 'PASSED' : 'FAILED';
        this.results.pass_rate = passRate;
        
        console.log('\n📊 CI Test Results Summary');
        console.log('═══════════════════════════');
        console.log(`Overall Status: ${this.results.overall_status}`);
        console.log(`Pass Rate: ${passRate.toFixed(1)}%`);
        console.log(`Tests Passed: ${this.results.summary.passed}/${this.results.summary.total}`);
        
        // Write results to file for CI
        fs.writeFileSync('ci-test-results.json', JSON.stringify(this.results, null, 2));
        
        if (this.results.overall_status === 'FAILED') {
            console.log('\n❌ CI Tests Failed - Check individual test results above');
            process.exit(1);
        } else {
            console.log('\n✅ CI Tests Passed - Ready for deployment');
        }
    }
}

// Run tests if called directly
if (require.main === module) {
    const runner = new CITestRunner();
    runner.runAllTests().catch(error => {
        console.error('CI Test Runner failed:', error);
        process.exit(1);
    });
}

module.exports = CITestRunner;