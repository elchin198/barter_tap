{ pkgs }: {
  deps = [
    pkgs.nodejs_18
    pkgs.postgresql
    pkgs.imagemagick
    pkgs.jq
  ];
}
