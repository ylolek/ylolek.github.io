
var layouts = (function(){
	var layoutArr = [];
		layoutArr[1] = [
			['XCDLTL', 'XXDLHT', 'XXDLHT', 'XXDLHT', 'XXDLHT', 'XXDLHT', 'XXDLHT', 'XXDLHT', 'XXDLHT', 'XXDLHT', 'XXDLHT', 'XXDLHT', 'XXDLHT', 'JDLTRH', 'JDLTLH', 'XXDLHT', 'XXDLHT', 'XXDLHT', 'XXDLHT', 'XXDLHT', 'XXDLHT', 'XXDLHT', 'XXDLHT', 'XXDLHT', 'XXDLHT', 'XXDLHT', 'XXDLHT', 'XCDLTR'],
			['XXDLVL', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXSLVR', 'XXSLVL', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXDLVR'],
			['XXDLVL', 'XXXPWC', 'XCSLTL', 'XXSLHB', 'XXSLHB', 'XCSLTR', 'XXXPWC', 'XCSLTL', 'XXSLHB', 'XXSLHB', 'XXSLHB', 'XCSLTR', 'XXXPWC', 'XXSLVR', 'XXSLVL', 'XXXPWC', 'XCSLTL', 'XXSLHB', 'XXSLHB', 'XXSLHB', 'XCSLTR', 'XXXPWC', 'XCSLTL', 'XXSLHB', 'XXSLHB', 'XCSLTR', 'XXXPWC', 'XXDLVR'],
			['XXDLVL', 'XXXPWE', 'XXSLVR', 'XXXPWE', 'XXXPWE', 'XXSLVL', 'XXXPWC', 'XXSLVR', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXSLVL', 'XXXPWC', 'XXSLVR', 'XXSLVL', 'XXXPWC', 'XXSLVR', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXSLVL', 'XXXPWC', 'XXSLVR', 'XXXPWE', 'XXXPWE', 'XXSLVL', 'XXXPWE', 'XXDLVR'],
			['XXDLVL', 'XXXPWC', 'XCSLBL', 'XXSLHT', 'XXSLHT', 'XCSLBR', 'XXXPWC', 'XCSLBL', 'XXSLHT', 'XXSLHT', 'XXSLHT', 'XCSLBR', 'XXXPWC', 'CSLBL2', 'CSLBR2', 'XXXPWC', 'XCSLBL', 'XXSLHT', 'XXSLHT', 'XXSLHT', 'XCSLBR', 'XXXPWC', 'XCSLBL', 'XXSLHT', 'XXSLHT', 'XCSLBR', 'XXXPWC', 'XXDLVR'],
			['XXDLVL', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXDLVR'],
			['XXDLVL', 'XXXPWC', 'CSLTL2', 'XXSLHB', 'XXSLHB', 'CSLTR2', 'XXXPWC', 'XCSLTL', 'XCSLTR', 'XXXPWC', 'CSLTL2', 'XXSLHB', 'XXSLHB', 'XXSLHB', 'XXSLHB', 'XXSLHB', 'XXSLHB', 'CSLTR2', 'XXXPWC', 'CSLTL2', 'CSLTR2', 'XXXPWC', 'CSLTL2', 'XXSLHB', 'XXSLHB', 'CSLTR2', 'XXXPWC', 'XXDLVR'],
			['XXDLVL', 'XXXPWC', 'CSLBL2', 'XXSLHT', 'XXSLHT', 'CSLBR2', 'XXXPWC', 'XXSLVR', 'XXSLVL', 'XXXPWC', 'CSLBL2', 'XXSLHT', 'XXSLHT', 'CSLTR4', 'CSLTL3', 'XXSLHT', 'XXSLHT', 'CSLBR2', 'XXXPWC', 'XXSLVR', 'XXSLVL', 'XXXPWC', 'CSLBL2', 'XXSLHT', 'XXSLHT', 'CSLBR2', 'XXXPWC', 'XXDLVR'],
			['XXDLVL', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXSLVR', 'XXSLVL', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXSLVR', 'XXSLVL', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXSLVR', 'XXSLVL', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXDLVR'],
			['XCDLBL', 'XXDLHB', 'XXDLHB', 'XXDLHB', 'XXDLHB', 'XCSLTR', 'XXXPWC', 'XXSLVR', 'CSLBL5', 'XXSLHB', 'XXSLHB', 'CSLTR2', 'XXXPWE', 'XXSLVR', 'XXSLVL', 'XXXPWE', 'CSLTL2', 'XXSLHB', 'XXSLHB', 'CSLBR4', 'XXSLVL', 'XXXPWC', 'XCSLTL', 'XXDLHB', 'XXDLHB', 'XXDLHB', 'XXDLHB', 'XCDLBR'],
			['XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXDLVL', 'XXXPWC', 'XXSLVR', 'CSLTL3', 'XXSLHT', 'XXSLHT', 'CSLBR2', 'XXXPWE', 'CSLBL2', 'CSLBR2', 'XXXPWE', 'CSLBL2', 'XXSLHT', 'XXSLHT', 'CSLTR4', 'XXSLVL', 'XXXPWC', 'XXDLVR', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE'],
			['XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXDLVL', 'XXXPWC', 'XXSLVR', 'XXSLVL', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXSLVR', 'XXSLVL', 'XXXPWC', 'XXDLVR', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE'],
			['XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXDLVL', 'XXXPWC', 'XXSLVR', 'XXSLVL', 'XXXPWE', 'CDLTLS', 'XXDLHB', 'XXXCDL', 'XSLHBP', 'XSLHBP', 'XXXCDR', 'XXDLHB', 'CDLTRS', 'XXXPWE', 'XXSLVR', 'XXSLVL', 'XXXPWC', 'XXDLVR', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE'],
			['XXDLHT', 'XXDLHT', 'XXDLHT', 'XXDLHT', 'XXDLHT', 'XCSLBR', 'XXXPWC', 'XCSLBL', 'CSLBR2', 'XXXPWE', 'XXDLVR', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXDLVL', 'XXXPWE', 'XCSLBL', 'XCSLBR', 'XXXPWC', 'XCSLBL', 'XXDLHT', 'XXDLHT', 'XXDLHT', 'XXDLHT', 'XXDLHT'],
			['XXXPWP', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWC', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXDLVR', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXDLVL', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWC', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWP'],
			['XXDLHB', 'XXDLHB', 'XXDLHB', 'XXDLHB', 'XXDLHB', 'XCSLTR', 'XXXPWC', 'XCSLTL', 'XCSLTR', 'XXXPWE', 'XXDLVR', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXDLVL', 'XXXPWE', 'XCSLTL', 'XCSLTR', 'XXXPWC', 'XCSLTL', 'XXDLHB', 'XXDLHB', 'XXDLHB', 'XXDLHB', 'XXDLHB'],
			['XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXDLVL', 'XXXPWC', 'XXSLVR', 'XXSLVL', 'XXXPWE', 'CDLBLS', 'XXDLHT', 'XXDLHT', 'XXDLHT', 'XXDLHT', 'XXDLHT', 'XXDLHT', 'CDLBRS', 'XXXPWE', 'XXSLVR', 'XXSLVL', 'XXXPWC', 'XXDLVR', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE'],
			['XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXDLVL', 'XXXPWC', 'XXSLVR', 'XXSLVL', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXSLVR', 'XXSLVL', 'XXXPWC', 'XXDLVR', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE'],
			['XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXDLVL', 'XXXPWC', 'XXSLVR', 'XXSLVL', 'XXXPWE', 'XCSLTL', 'XXSLHB', 'XXSLHB', 'XXSLHB', 'XXSLHB', 'XXSLHB', 'XXSLHB', 'XCSLTR', 'XXXPWE', 'XXSLVR', 'XXSLVL', 'XXXPWC', 'XXDLVR', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE', 'XXXPWE'],
			['XCDLTL', 'XXDLHT', 'XXDLHT', 'XXDLHT', 'XXDLHT', 'XCSLBR', 'XXXPWC', 'XCSLBL', 'XCSLBR', 'XXXPWE', 'XCSLBL', 'XXSLHT', 'XXSLHT', 'CSLTR4', 'CSLTL4', 'XXSLHT', 'XXSLHT', 'XCSLBR', 'XXXPWE', 'XCSLBL', 'XCSLBR', 'XXXPWC', 'XCSLBL', 'XXDLHT', 'XXDLHT', 'XXDLHT', 'XXDLHT', 'XCDLTR'],
			['XXDLVL', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXSLVR', 'XXSLVL', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXDLVR'],
			['XXDLVL', 'XXXPWC', 'XCSLTL', 'XXSLHB', 'XXSLHB', 'CSLTR2', 'XXXPWC', 'XCSLTL', 'XXSLHB', 'XXSLHB', 'XXSLHB', 'XCSLTR', 'XXXPWC', 'XXSLVR', 'XXSLVL', 'XXXPWC', 'XCSLTL', 'XXSLHB', 'XXSLHB', 'XXSLHB', 'XCSLTR', 'XXXPWC', 'CSLTL2', 'XXSLHB', 'XXSLHB', 'XCSLTR', 'XXXPWC', 'XXDLVR'],
			['XXDLVL', 'XXXPWC', 'XCSLBL', 'XXSLHT', 'CSLTR4', 'XXSLVL', 'XXXPWC', 'XCSLBL', 'XXSLHT', 'XXSLHT', 'XXSLHT', 'XCSLBR', 'XXXPWC', 'XCSLBL', 'XCSLBR', 'XXXPWC', 'XCSLBL', 'XXSLHT', 'XXSLHT', 'XXSLHT', 'XCSLBR', 'XXXPWC', 'XXSLVR', 'CSLTL3', 'XXSLHT', 'XCSLBR', 'XXXPWC', 'XXDLVR'],
			['XXDLVL', 'XXXPWE', 'XXXPWC', 'XXXPWC', 'XXSLVR', 'XXSLVL', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWE', 'XXXPWE', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXSLVR', 'XXSLVL', 'XXXPWC', 'XXXPWC', 'XXXPWE', 'XXDLVR'],
			['XJDLBL', 'XXSLHB', 'XCSLTR', 'XXXPWC', 'XXSLVR', 'XXSLVL', 'XXXPWC', 'XCSLTL', 'XCSLTR', 'XXXPWC', 'XCSLTL', 'XXSLHB', 'XXSLHB', 'XXSLHB', 'XXSLHB', 'XXSLHB', 'XXSLHB', 'XCSLTR', 'XXXPWC', 'XCSLTL', 'XCSLTR', 'XXXPWC', 'XXSLVR', 'XXSLVL', 'XXXPWC', 'XCSLTL', 'XXSLHB', 'XJDLBR'],
			['JDLTLV', 'XXSLHT', 'XCSLBR', 'XXXPWC', 'XCSLBL', 'XCSLBR', 'XXXPWC', 'XXSLVR', 'XXSLVL', 'XXXPWC', 'XCSLBL', 'XXSLHT', 'XXSLHT', 'CSLTR4', 'CSLTL3', 'XXSLHT', 'XXSLHT', 'XCSLBR', 'XXXPWC', 'XXSLVR', 'XXSLVL', 'XXXPWC', 'XCSLBL', 'XCSLBR', 'XXXPWC', 'XCSLBL', 'XXSLHT', 'JDLTRV'],
			['XXDLVL', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXSLVR', 'XXSLVL', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXSLVR', 'XXSLVL', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXSLVR', 'XXSLVL', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXDLVR'],
			['XXDLVL', 'XXXPWC', 'XCSLTL', 'XXSLHB', 'XXSLHB', 'XXSLHB', 'XXSLHB', 'CSLBR4', 'CSLBL5', 'XXSLHB', 'XXSLHB', 'XCSLTR', 'XXXPWC', 'XXSLVR', 'XXSLVL', 'XXXPWC', 'XCSLTL', 'XXSLHB', 'XXSLHB', 'CSLBR4', 'CSLBL5', 'XXSLHB', 'XXSLHB', 'XXSLHB', 'XXSLHB', 'XCSLTR', 'XXXPWC', 'XXDLVR'],
			['XXDLVL', 'XXXPWC', 'XCSLBL', 'XXSLHT', 'XXSLHT', 'XXSLHT', 'XXSLHT', 'XXSLHT', 'XXSLHT', 'XXSLHT', 'XXSLHT', 'XCSLBR', 'XXXPWC', 'XCSLBL', 'XCSLBR', 'XXXPWC', 'XCSLBL', 'XXSLHT', 'XXSLHT', 'XXSLHT', 'XXSLHT', 'XXSLHT', 'XXSLHT', 'XXSLHT', 'XXSLHT', 'XCSLBR', 'XXXPWC', 'XXDLVR'],
			['XXDLVL', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXXPWC', 'XXDLVR'],
			['XCDLBL', 'XXDLHB', 'XXDLHB', 'XXDLHB', 'XXDLHB', 'XXDLHB', 'XXDLHB', 'XXDLHB', 'XXDLHB', 'XXDLHB', 'XXDLHB', 'XXDLHB', 'XXDLHB', 'XXDLHB', 'XXDLHB', 'XXDLHB', 'XXDLHB', 'XXDLHB', 'XXDLHB', 'XXDLHB', 'XXDLHB', 'XXDLHB', 'XXDLHB', 'XXDLHB', 'XXDLHB', 'XXDLHB', 'XXDLHB', 'XCDLBR']
	   ];
	//sprite positions
	//leading Xs are just fills to keep everything 6 chars long
	var clipArr = [{},
				 {
				 	//corners
					XCDLTL : { x: 204, y: 48 }, //Corner Double Line Top Left
					XCDLTR : { x: 192, y: 48 }, //Corner Double Line Top Right
					XCDLBL : { x: 252, y: 48 }, //Corner Double Line Bottom Left
					XCDLBR : { x: 240, y: 48 }, //Corner Double Line Bottom Right

					XCSLTL : { x: 276, y: 60 }, //Corner Single Line Top Left
					CSLTL2 : { x: 276, y: 36 }, //Corner Single Line Top Left 2
					CSLTL3 : { x: 216, y: 60 }, //Corner Single Line Top Left 3
					CSLTL4 : { x: 216, y: 60 }, //Corner Single Line Top Left 4
					CSLTL5 : { x: 228, y: 36 }, //Corner Single Line Top Left 5
					CDLTLS : { x: 348, y: 36 }, //Corner Single Line Top Left Square
					XCSLTR : { x: 264, y: 60 }, //Corner Single Line Top Right
					CSLTR2 : { x: 264, y: 36 }, //Corner Single Line Top Right 2
					CSLTR3 : { x: 228, y: 36 }, //Corner Single Line Top Right 3
					CSLTR4 : { x: 228, y: 60 }, //Corner Single Line Top Right 4
					CSLTR5 : { x: 216, y: 36 }, //Corner Single Line Top Right 5
					CDLTRS : { x: 336, y: 36 }, //Corner Single Line Top Right Square
					XCSLBL : { x: 300, y: 60 }, //Corner Single Line Bottom Left
					CSLBL2 : { x: 324, y: 36 }, //Corner Single Line Bottom Left 2
					CSLBL3 : { x: 204, y: 36 }, //Corner Single Line Bottom Left 3
					CSLBL5 : { x: 240, y: 60 }, //Corner Single Line Bottom Left 5
					CDLBLS : { x: 372, y: 36 }, //Corner Single Line Bottom Left Square
					XCSLBR : { x: 288, y: 60 }, //Corner Single Line Bottom Right
					CSLBR2 : { x: 312, y: 36 }, //Corner Single Line Bottom Right 2
					CSLBR3 : { x: 192, y: 36 }, //Corner Single Line Bottom Right 3
					CSLBR4 : { x: 252, y: 60 }, //Corner Single Line Bottom Right 4
					CSLBR5 : { x: 192, y: 36 }, //Corner Single Line Bottom Right 5
					CDLBRS : { x: 360, y: 36 }, //Corner Single Line Bottom Right Square

					//junctions
					JDLTLH : { x: 312, y: 60 }, //Junction Double Line Top Left Horizontal
					JDLTLV : { x: 300, y: 48 }, //Junction Double Line Top Left Vertical
					JDLTRH : { x: 324, y: 60 }, //Junction Double Line Top Right Horizontal
					JDLTRV : { x: 288, y: 48 }, //Junction Double Line Top Right Vertical
					XJDLBL : { x: 276, y: 48 },  //Junction Double Line Bottom Left
					XJDLBR : { x: 264, y: 48 },  //Junction Double Line Bottom Right

					//lines
					XXDLHT : { x: 312, y: 48 }, //Double Line Horizontal Top
					XXDLHB : { x: 348, y: 48 }, //Double Line Horizontal Bottom
					XXDLVL : { x: 228, y: 48 }, //Double Line Vertical Left
					XXDLVR : { x: 216, y: 48 }, //Double Line Vertical Right

					XXSLHB : { x: 360, y: 48 }, //Single Line Horizontal Bottom
					XSLHBP : { x: 372, y:  0 }, //Single Line Horizontal Bottom Pink
					XXSLHT : { x: 252, y: 36 }, //Single Line Horizontal Top

					XXSLVL : { x: 288, y: 36 }, //Single Line Vertical Left
					XXSLVR : { x: 300, y: 36 }, //Single Line Vertical Right

					XXXCDL : { x: 204, y: 60 }, //Cage Door Left
					XXXCDR : { x: 192, y: 60 }, //Cage Door Right

					//pathways
					XXXPWC : { x: 192, y: 0 }, //Patway With Collectable (basically dots here)
					//XXXPWC : { x: 204, y: 0 }, //Patway With Collectable (basically dots here)
					XXXPWE : { x: 264, y: 0 },  //PathWay Empty
					XXXPWP : { x: 264, y: 0 },  //PathWay Portal

					//extras
					XX1HTS : { x: 12, y: 48 }, //1 Hundred/Thousend Start
					XX2HTS : { x: 24, y: 48 }, //2 Hundred/Thousend Start
					XX3HTS : { x: 36, y: 48 }, //3 Hundred/Thousend Start
					XX5HTS : { x: 48, y: 48 }, //5 Hundred/Thousend Start
					XX7HTS : { x: 60, y: 48 }, //7 Hundred/Thousend Start
					XXXXHE : { x: 72, y: 48 }, //Hundred End
					XXXXTE : { x: 84, y: 48 }, //Thousend End
				 }
				]


	return{
		getLayout : function(index){
			if (layoutArr[index] instanceof Array){
				return JSON.parse(JSON.stringify(layoutArr[index]));
			}else{
				error.throw('InvalidLayoutIndex', 'layoutArr[' + index + '] is not an array.');
				return false;
			}
		},

		getClips : function(index){
			if (typeof clipArr[index] === 'object' ){
				return clipArr[index];
			}else{
				error.throw('InvalidClipIndex', 'clipArr[' + index + '] is not an object.');
				return false;
			}
		},

		getClipPos : function(index, propName){
			if (typeof clipArr[index] != 'object' && typeof clipArr[index][propName] != 'object'){
				error.throw('InvalidClipPosition', 'clipArr[' + index + '] is: ' + typeof clipArr[index] + ' | clipArr[' + index + '][' + propName + '] is: ' + typeof clipArr[index][propName]);
				return false;
			}else{
				return clipArr[index][propName];
			}
		},

		getCellType : function(layoutIndex, col, row){
			if (layoutArr[layoutIndex] instanceof Array == false){
				error.throw('InvalidLayoutIndex', 'layoutArr[' + layoutIndex + '] is: ' + typeof layoutArr[layoutIndex]);
				return false;
			}

			if (layoutArr[layoutIndex][row] instanceof Array == false || typeof layoutArr[layoutIndex][row][col] === 'undefined'){
				error.throw('InvalidCellPosition', typeof layoutArr[layoutIndex][row]  + ' - ' + typeof layoutArr[layoutIndex][row][col]);
				return false;
			}

			return layoutArr[layoutIndex][row][col];
		},

		getCellsByType : function(index, typeArr){
			if (typeArr instanceof Array == false){
				error.throw('InvalidArrayType', typeArr + ' is not an array,');
				return false;
			}

			if (layoutArr[index] instanceof Array == false){
				error.throw('InvalidLayoutIndex', 'layoutArr[' + index + '] is not an array.');
				return false;
			}

			var matchArr = [];
			layoutArr[index].forEach(function(row, rowIndex){
				row.forEach(function(cell, colIndex){
					if (typeArr.indexOf(cell.toLowerCase()) != -1){
						matchArr.push({
							type : cell.toLowerCase(),
							row : rowIndex,
							col : colIndex
						});
					}
				});
			});

			return matchArr;
		}
	}
}());