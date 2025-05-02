import 'dart:html' as html;
import 'package:flutter/material.dart';

class LoginPage extends StatelessWidget {
  void redirectToGoogleLogin() {
    final redirect = html.window.location.origin;
    html.window.location.href = 'http://localhost:8000/login?redirect=$redirect';
  }

  @override
  Widget build(BuildContext context) {
    final token = Uri.base.queryParameters['token'];
    if (token != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        Navigator.pushReplacementNamed(context, '/home', arguments: token);
      });
    }

    return Scaffold(
      appBar: AppBar(title: Text('UAlg Cantina - Login')),
      body: Center(
        child: ElevatedButton(
          onPressed: redirectToGoogleLogin,
          child: Text('Entrar com Google'),
        ),
      ),
    );
  }
}
