pipeline {
    agent any

    environment {
        AZURE_CREDENTIALS_ID = 'azure-credentials'         // Jenkins credentials (username + password of Azure SP)
        AZURE_SUBSCRIPTION_ID = 'AZURE_SUBSCRIPTION_ID'     // Jenkins secret text with sub ID
        RESOURCE_GROUP = 'devops-rg'
        FRONTEND_APP_NAME = 'pfe-frontend'
        BACKEND_APP_NAME = 'pfe-backend'
    }
    tools{
        nodejs 'NodeJs-24'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                checkout scm
            }
        }

        stage('Build') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
                dir('server') {
                    sh 'npm install'
                    sh 'npm run build'
                }
                echo 'Build completed'
            }
        }

        stage('Deploy to Azure') {
            steps {
                withCredentials([
                    usernamePassword(credentialsId: "${AZURE_CREDENTIALS_ID}", usernameVariable: 'AZURE_USER', passwordVariable: 'AZURE_PASSWORD'),
                    string(credentialsId: "${AZURE_SUBSCRIPTION_ID}", variable: 'AZ_SUBSCRIPTION')
                ]) {
                    sh 'az login -u $AZURE_USER -p $AZURE_PASSWORD'
                    sh 'az account set --subscription $AZ_SUBSCRIPTION'

                    dir('server') {
                        sh '''
                            zip -r backend.zip .
                            az webapp deployment source config-zip \
                              --resource-group ${RESOURCE_GROUP} \
                              --name ${BACKEND_APP_NAME} \
                              --src backend.zip
                        '''
                    }

                    dir('frontend') {
                        sh '''
                            zip -r frontend.zip .
                            az webapp deployment source config-zip \
                              --resource-group ${RESOURCE_GROUP} \
                              --name ${FRONTEND_APP_NAME} \
                              --src frontend.zip
                        '''
                    }

                    echo 'Deployment to Azure App Services completed successfully!'
                }
            }
        }
    }

   post {
     always {
         script {
             sh "docker system prune -f"
        }
      echo "Pipeline execution completed"
    }
        success {
            echo 'Pipeline finished successfully '
        }
        failure {
            echo 'Pipeline failed  check logs'
        }
    }
}
