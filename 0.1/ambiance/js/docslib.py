#!/usr/bin/python3

import json
import subprocess
import sys

jdata=open('yuidoc.json')
data=json.load(jdata)
majver=data['majorversion']
cmd="bzr version-info | grep revno | cut -f2 -d\ "
bzrrev=p = subprocess.Popen(cmd, shell=True, stdout = subprocess.PIPE, stderr = subprocess.PIPE).communicate()[0]
bzrrev = bzrrev.decode('utf-8')
bzrrev = bzrrev.rstrip()
data['version']=majver + '~bzr' + bzrrev
with open('yuidoc.json', 'w') as f:
   json.dump(data, f, ensure_ascii=False, indent=4)
exit(0)
