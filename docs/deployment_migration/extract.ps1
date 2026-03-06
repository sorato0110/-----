$paths = @(
    "$env:LocalAppData\Google\Chrome\User Data\Default\Local Storage\leveldb\*",
    "$env:LocalAppData\Microsoft\Edge\User Data\Default\Local Storage\leveldb\*"
)

$output = "raw_data.txt"
Clear-Content $output -ErrorAction SilentlyContinue

foreach ($path in $paths) {
    if (Test-Path $(Split-Path $path)) {
        Get-ChildItem -Path $path -Include *.ldb,*.log | ForEach-Object {
            Select-String -Path $_.FullName -Pattern 'bayes(?:Tasks|Hypotheses|Logs|DailyLogs|SelfAnalysis)' -Encoding Default | ForEach-Object {
                Add-Content -Path $output -Value $_.Line -Encoding utf8
            }
        }
    }
}
