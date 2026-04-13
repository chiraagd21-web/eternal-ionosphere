$pages = @('about', 'careers', 'partners', 'contact', 'privacy', 'terms', 'cookie-policy', 'licensing', 'documentation')
foreach ($p in $pages) {
    $dir = "app/$p"
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force
    }
    Copy-Item -Path "app/info-template/page.tsx" -Destination "$dir/page.tsx" -Force
}
