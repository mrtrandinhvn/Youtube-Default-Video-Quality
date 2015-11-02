if not exist "release" mkdir "release"
xcopy css release\css\ /e /y
xcopy img release\img\ /e /y
xcopy js release\js\ /e /y
echo f | xcopy default_popup.html release\default_popup.html /y
echo f | xcopy manifest.json release\manifest.json /y