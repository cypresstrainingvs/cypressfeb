/*
 * Jenkinsfile - Cypress Test Execution Pipeline
 * ==============================================
 * 
 * This pipeline runs Cypress tests in Jenkins.
 * 
 * Prerequisites:
 * 1. Jenkins with Pipeline plugin
 * 2. Node.js installed on Jenkins agent (or use Docker)
 * 3. Git repository with this Jenkinsfile
 * 
 * Setup Instructions:
 * 1. Create a new Pipeline job in Jenkins
 * 2. Select "Pipeline script from SCM"
 * 3. Choose Git and enter your repository URL
 * 4. Set Script Path to "Jenkinsfile"
 * 5. Save and click "Build Now"
 */

pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS'  // Configure this in Jenkins Global Tool Configuration
    }
    
    environment {
        CI = 'true'
        CYPRESS_CACHE_FOLDER = "${WORKSPACE}/.cypress-cache"
    }
    
    options {
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }
    
    stages {
        
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo 'Installing npm dependencies...'
                // Use 'bat' for Windows Jenkins agent, 'sh' for Linux/Mac
                script {
                    if (isUnix()) {
                        sh 'npm ci || npm install'
                    } else {
                        bat 'npm ci || npm install'
                    }
                }
            }
        }
        
        stage('Verify Cypress') {
            steps {
                echo 'Verifying Cypress installation...'
                script {
                    if (isUnix()) {
                        sh 'npx cypress verify'
                    } else {
                        bat 'npx cypress verify'
                    }
                }
            }
        }
        
        stage('Run Cypress Tests') {
            steps {
                echo 'Running Cypress tests...'
                script {
                    if (isUnix()) {
                        sh 'npx cypress run --reporter mochawesome --reporter-options reportDir=cypress/reports/mochawesome,overwrite=false,html=true,json=true'
                    } else {
                        bat 'npx cypress run --reporter mochawesome --reporter-options reportDir=cypress/reports/mochawesome,overwrite=false,html=true,json=true'
                    }
                }
            }
        }
        
        stage('Run Day 4 Tests Only') {
            steps {
                echo 'Running Day 4 CI/CD demo tests...'
                script {
                    if (isUnix()) {
                        sh 'npx cypress run --spec "cypress/e2e/Day4/*.cy.js"'
                    } else {
                        bat 'npx cypress run --spec "cypress/e2e/Day4/*.cy.js"'
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo 'Archiving test artifacts...'
            
            // Archive videos
            archiveArtifacts artifacts: 'cypress/videos/**/*.mp4', allowEmptyArchive: true
            
            // Archive screenshots
            archiveArtifacts artifacts: 'cypress/screenshots/**/*.png', allowEmptyArchive: true
            
            // Archive reports
            archiveArtifacts artifacts: 'cypress/reports/**/*', allowEmptyArchive: true
        }
        
        success {
            echo 'All Cypress tests passed successfully!'
        }
        
        failure {
            echo 'Some tests failed. Check the reports and screenshots.'
        }
    }
}


/*
 * ALTERNATIVE: If you want to use Docker instead of NodeJS tool
 * Uncomment the block below and comment out the above pipeline
 */

/*
pipeline {
    agent {
        docker {
            image 'cypress/included:13.6.3'
            args '-u root:root'
        }
    }
    
    environment {
        CI = 'true'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npx cypress run'
            }
        }
    }
    
    post {
        always {
            archiveArtifacts artifacts: 'cypress/videos/**', allowEmptyArchive: true
            archiveArtifacts artifacts: 'cypress/screenshots/**', allowEmptyArchive: true
        }
    }
}
*/


/*
 * TRAINER NOTES - Jenkins Setup Steps
 * ====================================
 * 
 * Step 1: Install Required Plugins
 *   - Pipeline plugin
 *   - NodeJS plugin
 *   - Git plugin
 * 
 * Step 2: Configure NodeJS in Jenkins
 *   - Go to: Manage Jenkins > Global Tool Configuration
 *   - Add NodeJS installation
 *   - Name it "NodeJS" (must match tools section above)
 *   - Select version 18.x or higher
 * 
 * Step 3: Create Pipeline Job
 *   - New Item > Pipeline
 *   - Under Pipeline section:
 *     - Definition: Pipeline script from SCM
 *     - SCM: Git
 *     - Repository URL: your-repo-url
 *     - Branch: main or master
 *     - Script Path: Jenkinsfile
 * 
 * Step 4: Run the Build
 *   - Click "Build Now"
 *   - Watch Console Output
 *   - Check archived artifacts after completion
 * 
 * Common Issues:
 *   - "NodeJS not found": Configure NodeJS in Global Tool Configuration
 *   - "npm command not found": Ensure NodeJS tool is configured correctly
 *   - "Cypress not found": npm install may have failed, check logs
 */
