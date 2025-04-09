pipeline {
    agent any

    environment {
        NEXUS_REGISTRY = 'http://192.168.96.128:5000'  // The Docker Registry HTTP port from Nexus
        NEXUS_CREDENTIALS = 'nexus'  // Your Jenkins credentials ID
    }

    stages {
        stage('Build frontend docker image') {
            steps {
                script {
                    def frontendImage = docker.build("192.168.96.128:5000/monavenir_frontend", "./frontend")

                    docker.withRegistry("${NEXUS_REGISTRY}", NEXUS_CREDENTIALS) {
                        frontendImage.push('latest')
                    }
                }
            }
        }

        stage('Build backend docker image') {
            steps {
                script {
                    def backendImage = docker.build("192.168.96.128:5000/monavenir_backend", "./backend")

                    docker.withRegistry("${NEXUS_REGISTRY}", NEXUS_CREDENTIALS) {
                        backendImage.push('latest')
                    }
                }
            }
        }
    }
}
