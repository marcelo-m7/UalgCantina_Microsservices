class Prato {
  final String data;
  final String descricao;

  Prato({required this.data, required this.descricao});

  factory Prato.fromJson(Map<String, dynamic> json) {
    return Prato(data: json['data'], descricao: json['prato']);
  }
}