import 'package:flutter/material.dart';
import '../pages/login_page.dart';
import '../pages/home_page.dart';

class AppRoutes {
  static final routes = <String, WidgetBuilder>{
    '/': (context) => LoginPage(),
    '/home': (context) => HomePage(),
  };
}