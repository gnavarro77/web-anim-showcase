
        const root = document.getElementById("svg-container");
        const container = SvgHelper.createTag("g");
        root.appendChild(container);

        let fontSize = 24;
        let text = "Invente des produits innovants";
        let letters = SvgHelper.text2svg(text, fontSize);
        SvgHelper.appendChildren(container, letters);

        let seq1 = null;
        async function fadeInLetters(){
            seq1 = new LinearSequence(letters);
            await seq1.run(
                [{ opacity: 0 }, { opacity: 1 }],
                {
                    duration: 20,
                    easing: "ease-in-out",
                    fill: 'forwards'
                }
            )

        }

        async function hightlightLetters(){
            seq = new LinearSequence(letters);
            await seq.run(
                [{ fill: "#4A919E"}],
                {
                    duration: 20,
                    fill: 'forwards',
                    easing: "linear"
                }
            )
        }

        async function popUpLetters() {
            seq = new LinearSequence(letters);
            const scaleExpr = "scale(1, 2)";
            await seq.run(
                [{ transform:  scaleExpr}],
                {
                    duration: 200,
                    easing: "linear"
                }
            )
        }

        async function fallDownLetters(val){
            seq = new LinearSequence(letters);
            const expr = `translate(0px,${val}px)`;
            await seq.run(
                [{ transform:  expr}],
                {
                    duration: 100,
                    fill: 'forwards',
                    easing: "ease-in-out"
                }
            )
        }
        
        async function allAnim(){
            await fadeInLetters();
            //await seq1.reverse();

            //await popUpLetters();
            //await fallDownLetters(fontSize);
            //await SvgHelper.scale(container, 1, 4);
            await hightlightLetters();

        }

        allAnim();