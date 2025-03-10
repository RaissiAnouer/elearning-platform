pipeline {
    agent any

    environment {
        NEXUS_URL = 'http://localhost:8081'  // Update this if necessary
        NEXUS_CREDENTIALS = 'nexus' // Ensure this matches the credentials ID in Jenkins
        DOCKER_REPO = 'repository/docker-hosted/' // Check if this is your Nexus repository path
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    checkout scm
                }
            }
        }

        stage('Build frontend docker image') {
            steps {
                script {
                    def frontendImage = docker.build("monavenir_frontend", "./frontend")
                    frontendImage.tag('latest')
                    
                    docker.withRegistry("${NEXUS_URL}/${DOCKER_REPO}", NEXUS_CREDENTIALS) {
                        frontendImage.push('latest')
                    }
                }
            }
        }

        stage('Build backend docker image') {
            steps {
                script {
                    def backendImage = docker.build("monavenir_backend", "./backend")
                    backendImage.tag('latest')
                    
                    docker.withRegistry("${NEXUS_URL}/${DOCKER_REPO}", NEXUS_CREDENTIALS) {
                        backendImage.push('latest')
                    }
                }
            }
        }
    }
}
