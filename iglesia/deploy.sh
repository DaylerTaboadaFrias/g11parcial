echo "Switching to branch master"
git checkout master

echo "Building app..."
npm run build

echo "Deploying files to server..."
scp -r build/* tim@172.105.151.239:/var/www/172.105.151.239/

echo "Done"