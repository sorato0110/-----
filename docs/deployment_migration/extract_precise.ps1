$paths = @(
    "$env:LocalAppData\Google\Chrome\User Data\Default\Local Storage\leveldb\*",
    "$env:LocalAppData\Microsoft\Edge\User Data\Default\Local Storage\leveldb\*"
)
$outFile = "extracted_json.txt"
Clear-Content $outFile -ErrorAction SilentlyContinue

$keys = @("bayesTasks", "bayesHypotheses", "bayesLogs", "bayesDailyLogs", "bayesSelfAnalysis")
$iso88591 = [System.Text.Encoding]::GetEncoding("iso-8859-1")
$utf16le = [System.Text.Encoding]::Unicode

foreach ($path in $paths) {
    if (Test-Path $(Split-Path $path)) {
        Get-ChildItem -Path $path -Include *.ldb,*.log | ForEach-Object {
            $bytes = [System.IO.File]::ReadAllBytes($_.FullName)
            $rawString = $iso88591.GetString($bytes)
            
            foreach ($key in $keys) {
                $keyBytes = [System.Text.Encoding]::UTF8.GetBytes($key)
                $keyStr = $iso88591.GetString($keyBytes)
                
                $index = $rawString.IndexOf($keyStr)
                while ($index -ne -1) {
                    $chunkLen = [Math]::Min(100000, $rawString.Length - $index)
                    $chunk = $rawString.Substring($index, $chunkLen)
                    $chunkBytes = $iso88591.GetBytes($chunk)
                    
                    $foundJson = $false
                    for ($i = 0; $i -lt ($chunkBytes.Length - 1); $i++) {
                        if (($chunkBytes[$i] -eq 0x5B -or $chunkBytes[$i] -eq 0x7B) -and $chunkBytes[$i+1] -eq 0x00) {
                            $decodedStr = $utf16le.GetString($chunkBytes, $i, $chunkBytes.Length - $i)
                            if ($decodedStr -match "(?s)^(\[.*?\]|\{.*?\})") {
								$matchedJson = $matches[1]
								if ($matchedJson.Length -gt 10) {
									Add-Content -Path $outFile -Value "FOUND KEY: $key in $($_.Name)" -Encoding utf8
									Add-Content -Path $outFile -Value $matchedJson -Encoding utf8
									Add-Content -Path $outFile -Value "================================" -Encoding utf8
									$foundJson = $true
									break
								}
                            }
                        }
                    }
                    $index = $rawString.IndexOf($keyStr, $index + $keyStr.Length)
                }
            }
        }
    }
}
