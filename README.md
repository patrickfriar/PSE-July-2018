# PSE-July-2018
Fix for THEME-977


Production Release  07-11-2018

Removed `!important` from line 141 of /styles/slide-show.css

The style `color: #ffffff !important` color assignment for the slide show heading forced all carousel headings to appear in white, and ignore any custom colors set within the control panel.

Applied base munchen theme
Set red and blue heading colors for carousel slides
viewed storefront- headings are in white (#ffffff !important)
Identified /slide-show.css line 141 in console

Tested removing line entirely, and modifying by removing `!important`, same result for both methods.
See testing: https://www.screencast.com/t/hWJFN1rJ
