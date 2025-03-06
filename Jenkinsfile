pipeline {
    agent any
    environment {
        frontendImage = ''
        backendImage = ''
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[url: 'https://github.com/RaissiAnouer/monAvenir']])
            }
        }
        stage('Build frontend docker image') {
            steps {
                script {
                    frontendImage = docker.build('monavenir_frontend', './frontend')
                }
            }
        }
        stage('Build backend docker image') {
            steps {
                script {
                    backendImage = docker.build('monavenir_backend', './backend')
                }
            }
        }
        stage('Uploading to Nexus') {
            steps {
                script {
                    docker.withRegistry('http://localhost:8081', 'nexus') {
                        frontendImage.push('latest')
                        backendImage.push('latest')
                    }
                }
            }
        }
    }
}
