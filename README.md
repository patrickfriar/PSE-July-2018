# PSE-July-2018
Fix for THEME-977


Production Release  07-11-2018



What was fixed? 

Removed `!important` from line 141 of /styles/slide-show.css


Why was this fixed? 

The style `color: #ffffff !important` color assignment for the slide show heading classes `.slide-show-render-full .slide-heading` forced all carousel headings to appear in White, and ignore any custom colors set within the carousel controls of the control panel.


Steps for testing & resolution

-Applied base munchen theme
-Set red and blue heading colors for carousel slides
-Viewed storefront- headings are in white 
-Identified `slide-show.css` line 141 in console as causing the issue: `#ffffff !important`

Tested removing line entirely, and modifying by removing `!important`, same result for both methods. Opted to remove `!important` only, to maintain original code as much as possible.

See testing: https://www.screencast.com/t/hWJFN1rJ
