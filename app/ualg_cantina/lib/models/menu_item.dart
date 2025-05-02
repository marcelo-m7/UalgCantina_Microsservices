
class MenuItem {
  final String data;
  final String prato;

  MenuItem({required this.data, required this.prato});

  factory MenuItem.fromJson(Map<String, dynamic> json) {
    return MenuItem(
      data: json['data'],
      prato: json['prato'],
    );
  }
}
