pipeline {
  agent {
    docker {
      image 'cypress/included:13.6.3'       // Node + Cypress + browsers
      args  '-u root:root'                  // allow writing artifacts
    }
  }

  options {
    timestamps()
    ansiColor('xterm')
    buildDiscarder(logRotator(numToKeepStr: '20'))
    timeout(time: 30, unit: 'MINUTES')
  }

  environment {
    BASE_URL     = "https://example.com"
    NODE_OPTIONS = "--max_old_space_size=4096"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install Dependencies') {
      steps {
        sh '''
          set -euxo pipefail
          if [ -f package-lock.json ]; then
            npm ci
          else
            npm install
          fi

          # If reporters are not in package.json, uncomment this:
          # npm i -D mochawesome mochawesome-merge mochawesome-report-generator
        '''
      }
    }

    stage('Run Cypress (Headless + JSON reports)') {
      steps {
        sh '''
          set -euxo pipefail
          npx cypress run \
            --config baseUrl=${BASE_URL},video=true \
            --reporter mochawesome \
            --reporter-options html=false,json=true,reportDir=cypress/reports
        '''
      }
    }

    stage('Merge & Generate HTML (Mochawesome)') {
      steps {
        sh '''
          set -euxo pipefail
          # Only merge if we actually have JSON reports
          if ls cypress/reports/*.json >/dev/null 2>&1; then
            npx mochawesome-merge cypress/reports/*.json > cypress/reports/merged.json
            # Generate a single HTML report from the merged JSON
            npx marge cypress/reports/merged.json -o cypress/reports --inline
          else
            echo "No Mochawesome JSON reports found to merge."
          fi
        '''
      }
    }

    stage('Diagnostics (list files)') {
      steps {
        sh '''
          echo "Workspace: $(pwd)"
          echo "Tree under cypress/:"
          [ -d cypress ] && ls -la cypress || true
          [ -d cypress ] && find cypress -maxdepth 3 -type f -print || true
        '''
      }
    }

    stage('Publish Reports & Artifacts') {
      steps {
        // Publish HTML only if the file exists (avoid failing build)
        script {
          if (fileExists('cypress/reports/mochawesome.html')) {
            publishHTML(target: [
              reportDir: 'cypress/reports',
              reportFiles: 'mochawesome.html',   // <== correct default output
              reportName: 'Cypress Mochawesome Report',
              keepAll: true,
              alwaysLinkToLastBuild: true,
              allowMissing: false
            ])
          } else {
            echo 'No mochawesome.html found to publish.'
          }
        }

        archiveArtifacts artifacts: 'cypress/videos/**',      allowEmptyArchive: true
        archiveArtifacts artifacts: 'cypress/screenshots/**', allowEmptyArchive: true
        archiveArtifacts artifacts: 'cypress/reports/**',     allowEmptyArchive: true
      }
    }
  }

  post {
    success { echo '✅ Cypress pipeline succeeded.' }
    failure { echo '❌ Cypress pipeline failed. Check reports/videos.' }
    always  { echo 'Build finished; artifacts uploaded.' }
  }
}