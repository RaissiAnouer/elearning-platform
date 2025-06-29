pipeline{
    agent any
    enivrement{
        
    }
    stages{
        stage('checkout'){
            steps{
                echo'checking out the code'
                checkout scm
        }
    }
        stage('build'){
            steps{
                dir('frontend'){
                    sh 'npm install'
                    sh 'npm run build'
                }
                dir('server'){
                    sh 'npm install'
                    sh 'npm rurn build'
                }
                echo 'application successfully built'
         
            }
        }
        stage('deploy'){
            

        }
