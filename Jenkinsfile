pipeline {
    agent any

    environment {
        NEXUS_REGISTRY = 'http://192.168.96.128:5000'  // The Docker Registry HTTP port
        NEXUS_CREDENTIALS = 'nexus'  // Jenkins credentials ID for Nexus login
    }

    stages {
        stage('Build frontend docker image') {
            steps {
                script {
                    // Build the frontend Docker image
                    def frontendImage = docker.build("monavenir_frontend", "./frontend")

                    // Push to Nexus Docker registry
                    docker.withRegistry("${NEXUS_REGISTRY}", "${NEXUS_CREDENTIALS}") {
                        frontendImage.push('latest')
                    }
                }
            }
        }

        stage('Build backend docker image') {
            steps {
                script {
                    // Build the backend Docker image
                    def backendImage = docker.build("monavenir_backend", "./server")

                    // Push to Nexus Docker registry
                    docker.withRegistry("${NEXUS_REGISTRY}", "${NEXUS_CREDENTIALS}") {
                        backendImage.push('latest')
                    }
                }
            }
        }
    }
}
