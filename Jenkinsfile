pipeline{
    agent any
    environment{
        imageName="monavenir"
        fontendImage=''
        backendImage=''
    }
    stages{
        stage('checkout'){
            steps{
            checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[url: 'https://github.com/RaissiAnouer/monAvenir']])
        
            }
        }    
      stage('Build fontend backend image') {
            steps {
                script {
                frontendImage=docker.build('monavenir_frontend','./frontend')}
            }    
        }
         stage('Build backend docker image') {
            steps {
                script {
                backendImage=docker.build('monavenir_backend','./backend')}
            }    
        }
    }
    
}
