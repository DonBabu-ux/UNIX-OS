package com.launcher.modules

import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.util.Base64
import com.facebook.react.bridge.*
import java.io.ByteArrayOutputStream

class AppListModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "AppListModule"
    }

    @ReactMethod
    fun getInstalledApps(promise: Promise) {
        try {
            val pm = reactApplicationContext.packageManager
            val intent = android.content.Intent(android.content.Intent.ACTION_MAIN, null)
            intent.addCategory(android.content.Intent.CATEGORY_LAUNCHER)
            
            val resolveInfos = pm.queryIntentActivities(intent, 0)
            
            // Sort ResolveInfo objects alphabetically by label before mapping to React Maps
            val sortedResolveInfos = resolveInfos.sortedBy { it.loadLabel(pm).toString().lowercase() }
            
            val appList = Arguments.createArray()

            for (resolveInfo in sortedResolveInfos) {
                val appMap = Arguments.createMap()
                val pkgName = resolveInfo.activityInfo.packageName
                val label = resolveInfo.loadLabel(pm).toString()
                
                appMap.putString("name", label)
                appMap.putString("packageName", pkgName)
                
                // Convert icon to Base64
                val icon = resolveInfo.loadIcon(pm)
                val base64Icon = drawableToBase64(icon)
                appMap.putString("icon", base64Icon)

                appList.pushMap(appMap)
            }
            promise.resolve(appList)
        } catch (e: Exception) {
            promise.reject("FETCH_ERROR", e.message)
        }
    }

    private fun drawableToBase64(drawable: Drawable): String {
        val bitmap = if (drawable is BitmapDrawable) {
            drawable.bitmap
        } else {
            val width = if (drawable.intrinsicWidth > 0) drawable.intrinsicWidth else 1
            val height = if (drawable.intrinsicHeight > 0) drawable.intrinsicHeight else 1
            val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
            val canvas = Canvas(bitmap)
            drawable.setBounds(0, 0, canvas.width, canvas.height)
            drawable.draw(canvas)
            bitmap
        }

        val outputStream = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, outputStream)
        val byteArray = outputStream.toByteArray()
        return Base64.encodeToString(byteArray, Base64.DEFAULT)
    }
}
