# Deployment Guide

## Current Production Setup

### Live URLs
- **Frontend**: https://lms-frontend-98mc.onrender.com
- **Backend API**: https://lms-d0ql.onrender.com
- **Database**: MongoDB Atlas (Cloud)

### Hosting Platform
- **Render** - Both frontend and backend
- **Free Tier** - Services may spin down with inactivity

## Render Configuration

### Backend Service (lms)
- **Type**: Web Service
- **Environment**: Node
- **Region**: Oregon
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Auto-Deploy**: Yes (on git push to main)

**Environment Variables:**
```
NODE_ENV=production
MONGODB_URI=<your-mongodb-atlas-uri>
JWT_SECRET=<your-secret-key>
JWT_EXPIRE=7d
```

### Frontend Service (lms-frontend)
- **Type**: Static Site
- **Environment**: Static
- **Region**: Oregon
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Auto-Deploy**: Yes (on git push to main)

## Deployment Workflow

### Automatic Deployment
1. Make changes to code
2. Commit changes: `git commit -m "your message"`
3. Push to GitHub: `git push origin main`
4. Render automatically detects push
5. Backend redeploys (~1-2 minutes)
6. Frontend rebuilds (~1-2 minutes)
7. Check deploy logs in Render dashboard

### Manual Deployment
1. Go to Render dashboard
2. Select service (lms or lms-frontend)
3. Click **Manual Deploy** button
4. Select **Deploy latest commit**
5. Wait for deployment to complete

### Clear Cache & Redeploy
If deployment issues occur:
1. Go to Render dashboard
2. Select service
3. Click **Manual Deploy**
4. Select **Clear build cache & deploy**
5. Wait for fresh build

## Configuration Files

### render.yaml (Root)
Defines both services for Render:
```yaml
services:
  - type: web
    name: lms
    env: node
    rootDir: backend
    # ... backend config
  
  - type: web
    name: lms-frontend
    env: static
    rootDir: frontend
    # ... frontend config
```

### Frontend API Configuration
File: `frontend/src/config/api.js`
```javascript
const PRODUCTION_BACKEND = 'https://lms-d0ql.onrender.com';
```

**Important**: Update this URL if backend URL changes.

### Backend CORS Configuration
File: `backend/server.js`
```javascript
const allowedOrigins = [
  'https://lms-frontend-98mc.onrender.com',
  'http://localhost:5173',
  'http://localhost:3000',
];
```

**Important**: Add new frontend URLs here when deploying to new domains.

## Database Setup

### MongoDB Atlas
1. Create account at mongodb.com
2. Create new cluster (free tier available)
3. Create database user with password
4. Whitelist IP addresses (0.0.0.0/0 for Render)
5. Get connection string
6. Add to Render environment variables as `MONGODB_URI`

### Connection String Format
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

## Troubleshooting

### Backend Not Responding
- Check Render logs for errors
- Verify environment variables are set
- Check MongoDB Atlas connection
- Ensure service is not sleeping (free tier)

### Frontend CORS Errors
- Verify backend URL in `frontend/src/config/api.js`
- Check CORS whitelist in `backend/server.js`
- Ensure both services are deployed

### Build Failures
- Check build logs in Render dashboard
- Verify package.json dependencies
- Try "Clear build cache & deploy"
- Check Node.js version compatibility

### Database Connection Issues
- Verify MongoDB Atlas IP whitelist
- Check connection string format
- Ensure database user has correct permissions
- Test connection string locally

## Monitoring

### Check Service Health
- Backend: https://lms-d0ql.onrender.com/api/health
- Should return: `{"status":"OK","message":"Server is running"}`

### View Logs
1. Go to Render dashboard
2. Select service
3. Click **Logs** tab
4. View real-time logs

### Monitor Performance
- Check response times in Render dashboard
- Monitor error rates
- Track deployment frequency
- Review resource usage

## Scaling

### Upgrade from Free Tier
- Go to Render dashboard
- Select service
- Click **Upgrade** button
- Choose paid plan for:
  - No spin-down on inactivity
  - More resources
  - Better performance
  - Custom domains

### Horizontal Scaling
- Render automatically handles load balancing
- Paid plans support multiple instances
- Database scales independently on MongoDB Atlas

## Security

### Environment Variables
- Never commit `.env` files
- Use Render dashboard to set secrets
- Rotate JWT_SECRET periodically
- Use strong MongoDB passwords

### HTTPS
- Render provides free SSL certificates
- All traffic encrypted by default
- No additional configuration needed

### Database Security
- Use MongoDB Atlas network access controls
- Enable authentication
- Use strong passwords
- Regular backups enabled

## Backup & Recovery

### Database Backups
- MongoDB Atlas provides automatic backups
- Free tier: Daily snapshots
- Paid tier: Continuous backups

### Code Backups
- GitHub repository serves as backup
- All commits preserved
- Can rollback to any previous version

### Rollback Deployment
1. Go to Render dashboard
2. Select service
3. Go to **Events** tab
4. Find previous successful deploy
5. Click **Redeploy**

## Cost Optimization

### Free Tier Limits
- Backend: Spins down after 15 minutes of inactivity
- Frontend: Always available (static site)
- Database: 512 MB storage limit

### Reduce Costs
- Use free tier for development/testing
- Upgrade only production services
- Monitor resource usage
- Optimize database queries
- Implement caching

## Best Practices

### Development Workflow
1. Develop locally first
2. Test thoroughly
3. Commit to feature branch
4. Merge to main after review
5. Automatic deployment to production

### Code Quality
- Run linters before commit
- Write meaningful commit messages
- Keep dependencies updated
- Document changes in README

### Monitoring
- Check logs regularly
- Monitor error rates
- Track performance metrics
- Set up alerts for critical issues

## Support

### Render Support
- Documentation: https://render.com/docs
- Community: https://community.render.com
- Status: https://status.render.com

### MongoDB Atlas Support
- Documentation: https://docs.atlas.mongodb.com
- Support: https://support.mongodb.com

---

**Last Updated**: April 21, 2026
**Status**: Production Ready ✅
