<script lang="ts">
  let { dataset } = $props();

  console.log(dataset);

  let pinyinInput: HTMLInputElement;
  let pinyinInputVal: string = $state("");
  let toneBtnGroup: HTMLDivElement;
  let toneOptions: string[] = $state([]);
  
  function getRandomHanzi(hanziDataset: any) {
    let hanzi = Object.keys(hanziDataset);
    return hanzi[hanzi.length * Math.random() << 0];
  }

  function displayTones(inputChar: string) {
    switch(inputChar.toLowerCase()) {
      case 'a':
        setToneOpts(['ā', 'á', 'ǎ', 'à']);
        break;
      case 'e':
        setToneOpts(['ē', 'é', 'ě', 'è']);
        break;
      case 'i':
        setToneOpts(['ī', 'í', 'ǐ', 'ì']);
        break;
      case 'o':
        setToneOpts(['ō', 'ó', 'ǒ', 'ò']);
        break;
      case 'u':
        setToneOpts(['ū', 'ú', 'ǔ', 'ù', 'ü', 'ǖ', 'ǘ', 'ǚ', 'ǜ']);
        break;
    }
  }

  function setToneOpts(toneVariations: string[]) {
    toneOptions = toneVariations;
  }

  function setCharAt(str: string, index: number, chr: string) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}

  const chosenHanzi = getRandomHanzi(dataset);

</script>

<div class="component-wrapper">
  <h1>{chosenHanzi}</h1>
  <p>{dataset[chosenHanzi].pinyin}</p>
  <p>{dataset[chosenHanzi].pinyin.normalize("NFD").replace(/[\u0300-\u036f]/g, "")}</p>
  <div class="inputs-container">
    <input type="text" name="" id=""
    bind:this={pinyinInput}
    bind:value={pinyinInputVal}
    onkeyup={() => {
      const lastChar: string = pinyinInputVal.slice(-1);
      if(lastChar && 'aeiou'.includes(lastChar)) {
        toneBtnGroup.style.display = "flex";
        displayTones(lastChar);
      }
    }}
    >
    <div class="tone-btns-container" bind:this={toneBtnGroup}>
      {#each toneOptions as toneOption}
        <button class="tone-btn"
        onclick={() => {
          if(pinyinInputVal.slice(-1).normalize("NFD").replace(/[\u0300-\u036f]/g, "") === toneOption.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) {
            pinyinInputVal = pinyinInputVal.slice(0, -1).concat(toneOption);
          } else { // in case another letter has been typed since vowel...
            for(let i=pinyinInputVal.length-1; i>=0; i--) {
              if("aeiou".includes(pinyinInputVal.charAt(i))) {
                pinyinInputVal = setCharAt(pinyinInputVal, i, toneOption);
                break;
              }
            }
          }
          pinyinInput.focus();
        }}
        >{toneOption}</button>
      {/each}
    </div>
    <span>
      <button>Check</button>
      <button>Hint</button>
    </span>
    
  </div>
</div>

<style>
  .component-wrapper {
    box-shadow: 2px 4px 5px;
    min-width: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .inputs-container {
    width: 250px;
    padding: 1rem;
  }

  .tone-btns-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 5px 0px;
  }

  .tone-btn {
    background-color: #faedcd;
    width: 40px;
    margin-left: 2px;
    margin-right: 2px;
    /* border: 1px solid black; */
    /* box-shadow: px 1px 1px; */
    border-radius: 5px;
  }
</style>