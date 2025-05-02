import 'package:flutter/material.dart';
import '../pages/login_page.dart';
import '../pages/home_page.dart';
import '../pages/menu_page.dart';

class AppRoutes {
  static const login = '/';
  static const home = '/home';
  static const menu = '/menu';

  static Map<String, WidgetBuilder> routes = {
    login: (_) => LoginPage(),
    home: (_) => HomePage(),
    menu: (_) => MenuPage(token: ''), // será substituído via arguments
  };
}
