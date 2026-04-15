package com.launcher

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabFabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class LauncherActivity : ReactActivity() {

    override fun getMainComponentName(): String = "SmartLauncher"

    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabFabricEnabled)
}
