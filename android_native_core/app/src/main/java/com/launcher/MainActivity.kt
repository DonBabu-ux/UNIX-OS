package com.launcher

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Redirect to LauncherActivity if opened directly
        startActivity(Intent(this, LauncherActivity::class.java))
        finish()
    }
}
