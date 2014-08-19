Destiny of Spirits: Merging Calculator
======================================

Destiny of Spirits: Merging Calculator is an application that calculates the amount of EXP gained from merging Enhancer Spirits into a Base Spirit. As Destiny of Spirits does not display the amount of EXP that would be gained from merging, this application provides its users with the opportunity to merge spirits more efficiently.

##Usage

To use this tool:
* Input the Level and EXP % of the base spirit
* Input the Cost/Rarity and Level/% (if necessary) of the enhancer spirits.
* Check the appropriate EXP modifier checkboxes.
* Click Merge.

###Math

If the EXP percentage of the Base Spirit is not inputted, it will default to 0%. If the levels and EXP percentages of the Enhancer Spirits are not inputted, they will default to Level 1 [0%]. 

This application works by converting the level/% of the Base Spirit into a flat EXP value.

The enhancer spirits are also converted into a flat EXP value by the formula as shown:

```html
EXP = (Cost x Rarity) + (EnhancerEXP x 0.3)
```

Where:
* Cost is the cost of the enhancer spirit.
* Rarity is rarity of the enhancer spirit (C = 1, UC = 2, R = 3, SR = 4).
* EnhancerEXP is the base EXP that the enhancer spirit possesses.

The EXP gained can be further increased by the following:
* If the Enhancer Spirit's element matches the base Spirit's Element, the Enhancer Spirit will provide 10% more EXP.
* If your Base Spirit's element matches the Daily Element (or Daily Fortune for Dark/Light Spirits), merging will grant you 10% more EXP.
* Occasionally, EXP gained by merging will increase by 50%.

###Merge Cost

As merging costs spirit points, this application will provide the amount of spirit points required to merge.

The formula for the cost of merging is as shown:

```html
If BaseLevel < 30
  SP = (BaseLevel x 10) + 90
Else
  SP = (BaseLevel x 20) - 200
```
