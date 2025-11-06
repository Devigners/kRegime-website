# GitHub Actions CI/CD Setup

This document explains the CI/CD pipeline configuration for deploying to Vercel and Supabase.

## Overview

The pipeline automatically:
1. **Waits for Vercel deployment** to complete (triggered automatically by Vercel's GitHub integration)
2. **Pushes database migrations to Supabase** after successful Vercel deployment

## Branch Strategy

This project uses a three-branch deployment strategy:

| Branch | Environment | Vercel Integration | Supabase Project | Workflow Triggers |
|--------|-------------|-------------------|------------------|-------------------|
| `dev` | Development | ✅ Yes | None | Vercel deployment only (no Supabase) |
| `sandbox` | Staging | ✅ Yes | Staging Supabase | Vercel + Supabase deployment |
| `main` | Production | ✅ Yes | Production Supabase | Vercel + Supabase deployment |

### Workflow
1. Work and push changes to `dev` branch (Vercel deploys, but Supabase migrations are NOT pushed)
2. Merge `dev` → `sandbox` to deploy to staging environment (Vercel + Supabase)
3. Merge `sandbox` → `main` to deploy to production environment (Vercel + Supabase)

## Workflow File

Location: `.github/workflows/deploy.yml`

## Required GitHub Secrets

You need to configure the following secrets in your GitHub repository:

### 1. Navigate to Repository Settings
Go to: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

### 2. Add the Following Secrets

| Secret Name | Description | How to Get It |
|-------------|-------------|---------------|
| `SUPABASE_ACCESS_TOKEN` | Supabase access token for CLI authentication (shared) | [Generate here](https://supabase.com/dashboard/account/tokens) |
| **Staging Secrets** | | |
| `STAGING_DB_PASSWORD` | Staging Supabase database password | Found in staging project settings → Database |
| `STAGING_PROJECT_ID` | Staging Supabase project reference ID | Found in staging project settings → General → Reference ID |
| **Production Secrets** | | |
| `PRODUCTION_DB_PASSWORD` | Production Supabase database password | Found in production project settings → Database |
| `PRODUCTION_PROJECT_ID` | Production Supabase project reference ID | Found in production project settings → General → Reference ID |

### Getting Supabase Credentials

#### SUPABASE_ACCESS_TOKEN
1. Go to https://supabase.com/dashboard/account/tokens
2. Click "Generate New Token"
3. Give it a name (e.g., "GitHub Actions")
4. Copy the token and add it to GitHub secrets

#### SUPABASE_PROJECT_ID
1. Go to your Supabase project dashboard
2. Click on "Project Settings" (gear icon)
3. Under "General" → "Reference ID", copy the project ref
4. Example format: `abcdefghijklmnop`

#### SUPABASE_DB_PASSWORD
1. Go to your Supabase project dashboard
2. Click on "Project Settings" → "Database"
3. Find your database password (you may need to reset it if you don't have it saved)
4. Copy the password and add it to GitHub secrets

## How It Works

### Trigger Events
The workflow runs on:
- **Push** to `main`, `sandbox`, or `dev` branches
- **Pull requests** to `main` or `sandbox` branches

### Jobs

#### 1. `wait-for-vercel` Job
- Runs for all three branches: `dev`, `sandbox`, and `main`
- Waits for Vercel's automatic deployment to complete
- Uses the `wait-for-vercel-preview` action
- Times out after 10 minutes if deployment doesn't complete
- Outputs the deployment URL for reference

#### 2. `deploy-supabase` Job
- **Only runs for `sandbox` and `main` branches** (NOT for `dev`)
- Only runs on push events (not PRs)
- Requires the `wait-for-vercel` job to complete successfully
- Automatically selects the correct Supabase project based on branch:
  - `sandbox` branch → Staging Supabase project
  - `main` branch → Production Supabase project
- Checks out your code
- Sets up Supabase CLI
- Links to the appropriate Supabase project
- Pushes all pending database migrations from `supabase/migrations/`
- Provides a deployment summary with environment info

## Testing the Workflow

### Working in Dev Branch (Vercel Only)
1. Make changes in `dev` branch
2. Push to `dev` branch
3. **Vercel deploys automatically**
4. **No Supabase migrations pushed** - safe for testing without affecting databases
5. Check the Actions tab to see Vercel deployment status

### Deploying to Staging
1. Merge `dev` → `sandbox` (or push directly to `sandbox`)
2. Vercel automatically deploys to staging environment
3. Workflow waits for Vercel deployment
4. Then pushes migrations to **staging Supabase project**
5. Check the Actions tab to see progress

### Deploying to Production
1. Merge `sandbox` → `main` (or push directly to `main`)
2. Vercel automatically deploys to production environment
3. Workflow waits for Vercel deployment
4. Then pushes migrations to **production Supabase project**
5. Check the Actions tab to see progress

### For Pull Requests
1. Open a PR to `sandbox` or `main`
2. The workflow will wait for Vercel preview deployment
3. Supabase deployment will NOT run (only verifies Vercel deployment)
4. Review changes before merging

## Monitoring

### View Workflow Runs
1. Go to your GitHub repository
2. Click on the "Actions" tab
3. Select the workflow run you want to inspect
4. View logs for each job

### Common Issues

#### Workflow fails at "Wait for Vercel Deployment"
- **Cause**: Vercel deployment is taking too long or failed
- **Solution**: Check Vercel dashboard for deployment errors

#### Workflow fails at "Link Supabase project"
- **Cause**: Invalid `SUPABASE_PROJECT_ID` or `SUPABASE_ACCESS_TOKEN`
- **Solution**: Verify your GitHub secrets are correct

#### Workflow fails at "Push database migrations"
- **Cause**: Migration conflicts or invalid `SUPABASE_DB_PASSWORD`
- **Solution**: 
  - Check migration files in `supabase/migrations/`
  - Verify database password is correct
  - Check Supabase project is accessible

## Manual Deployment

If you need to manually push migrations without the GitHub workflow:

```bash
# Make sure you have Supabase CLI installed
npm install -g supabase

# Link to your project
supabase link --project-ref YOUR_PROJECT_ID

# Push migrations
supabase db push
```

## Best Practices

1. **Test migrations locally first** using `supabase db reset`
2. **Use pull requests** to review migrations before they go to production
3. **Keep migrations small and focused** - one change per migration file
4. **Name migrations descriptively** - include date and purpose
5. **Never edit existing migrations** - create new ones instead
6. **Monitor workflow runs** regularly in the Actions tab

## Rollback Strategy

If a migration causes issues:

1. Create a new migration to revert changes
2. Test locally first
3. Push the revert migration through the normal workflow

## Security Notes

- Never commit secrets to your repository
- Rotate access tokens periodically
- Use different Supabase projects for staging/production
- Review migration files in PRs before merging

## Additional Resources

- [Supabase CLI Documentation](https://supabase.com/docs/guides/cli)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Deployments](https://vercel.com/docs/deployments/overview)
