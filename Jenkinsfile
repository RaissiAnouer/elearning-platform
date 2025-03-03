pipeline {
    agent any
    stages {
        stage('Install Frontend Dependencies') {
            steps {
                dir('frontend') {
                    sh 'npm install'  // Install frontend dependencies
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm run build'  // Runs tsc and vite build in sequence
                }
            }
        }

        stage("Deploy") {
            steps {
                echo 'Deploying the application'
            }
        }
    }
}