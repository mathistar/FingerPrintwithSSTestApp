Test app for FingerPrint and store the encrypted 
token in Secure Storage.

Minor change required in FingerPrintAuth.java for the
Method createKey()

 .setUserAuthenticationRequired(true)
 
 to
 
 .setUserAuthenticationRequired(mDisableBackup)
 
 which will through exception in case of FingerPrint change 
 detected.
 