# SJRK Story Telling Deployment

The following components need to exist per branch/website for deployments to work correctly:

* The GitHub Actions workflow in the repository with these custom configuration per branch/website:
  * Name
  * Branch
  * PROJECT_ID
  * PROJECT_SMOKETEST_URL

* In the deployment server:
  * /srv/$PROJECT_ID/src directory with a clone of the repository
  * /srv/$PROJECT_ID/deploy.env with the environment variables required by docker-compose
