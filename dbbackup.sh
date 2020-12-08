#!/bin/bash
 
#Force file syncronization and lock writes
#mongo admin --eval "printjson(db.fsyncLock())"
TIMESTAMP=`date +"%Y-%m-%d-%H:%M"`
MONGODUMP_PATH="/usr/bin/mongodump"
MONGO_HOST="localhost"
MONGO_PORT="27017"
MONGO_DATABASE="shaadikarlo-dev"
APP_NAME="dbbackups"
BACKUPS_DIR="/home/nitish/SHAADIKARLOBACKUP/$APP_NAME"
BACKUP_NAME="$APP_NAME-$TIMESTAMP" 
echo BACKUPS_DIR
echo BACKUP_NAME
 
# Create backup
$MONGODUMP_PATH -h $MONGO_HOST:$MONGO_PORT -d $MONGO_DATABASE
 
# Add timestamp to backup
mkdir -p $BACKUPS_DIR
mv dump $BACKUP_NAME
tar -zcvf $BACKUPS_DIR/$BACKUP_NAME.tgz $BACKUP_NAME
rm -rf $BACKUP_NAME
 
# Upload to S3
# aws s3 cp $BACKUPS_DIR/$BACKUP_NAME.tgz s3://elasticbeanstalk-ap-southeast-1-875368596541/MongoDB_Backup/$BACKUP_NAME.tgz
 aws s3 cp $BACKUPS_DIR/$BACKUP_NAME.tgz s3://shaadikarlo-dbbackup/backup/$BACKUP_NAME.tgz

 
#Unlock databases write
#mongo admin --eval "printjson(db.fsyncUnlock())"
