<script lang="ts">
  import toast from "svelte-french-toast";

  let { dataset } = $props();

  console.log(dataset);

  let pinyinInput: HTMLInputElement;
  let pinyinInputVal: string = $state("");
  let toneBtnGroup: HTMLDivElement;
  let toneOptions: string[] = $state([]);
  let checkBtn: HTMLButtonElement;
  let hintBtn: HTMLButtonElement;
  let showHint: boolean = $state(false);
  let showAnswer: boolean = $state(false);
  
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

  function checkAnswer() {
    if(pinyinInputVal.replaceAll(" ", "") === dataset[chosenHanzi].pinyin.replaceAll(" ", "")) {
      toast.success("Correct");
    } else if(pinyinInputVal.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "") === dataset[chosenHanzi].pinyin.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "")) {
      toast.success("Correct - but pay attention to the tones!");
    } else {
      toast.error(`Incorrect, the answer was ${dataset[chosenHanzi].pinyin}`);
    }
    showHint = false;
    showAnswer = true;
    pinyinInput.disabled = true;
    hintBtn.disabled = true;
    checkBtn.disabled = true;
    toneBtnGroup.style.display = "none";
  }

  const chosenHanzi = getRandomHanzi(dataset);

</script>

<div class="component-wrapper">
  <h1 class="hanzi-display">{chosenHanzi}</h1>
  {#if showHint}
    <p class="hint">
      {dataset[chosenHanzi].pinyin.substring(0,1)}
      {dataset[chosenHanzi].pinyin.length < 5 ? "___" : "______"}
    </p>
  {/if}
  {#if showAnswer}
    <p>{dataset[chosenHanzi].pinyin}</p>
  {/if}
  <form class="hanzi-form" autocomplete="off">
    <input type="text" name="" id="" class="pinyin-input" placeholder="Pinyin Translation..."
    bind:this={pinyinInput}
    bind:value={pinyinInputVal}
    onkeyup={() => {
      const lastChar: string = pinyinInputVal.slice(-1);
      if(lastChar && 'aeiou'.includes(lastChar)) {
        toneBtnGroup.style.display = "flex";
        displayTones(lastChar);
      }
      if(!pinyinInputVal) {
        toneBtnGroup.style.display = "none";
      } else {

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
              if("aeiou".includes(pinyinInputVal.charAt(i).normalize("NFD").replace(/[\u0300-\u036f]/g, ""))) {
                pinyinInputVal = setCharAt(pinyinInputVal, i, toneOption);
                break;
              }
              // pinyinInputVal = pinyinInputVal.concat(toneOption);
            }
          }
          pinyinInput.focus();
        }}
        >{toneOption}</button>
      {/each}
    </div>
    <div class="control-btns">
      <button bind:this={checkBtn}
        onclick={checkAnswer}
      >Check</button>
      <button bind:this={hintBtn}
        onclick={ () => {
          showHint = true;
          hintBtn.disabled = true;
        }}
      >Hint</button>
    </div>
    
  </form>
</div>

<style>
  .component-wrapper {
    box-shadow: 2px 4px 5px;
    min-width: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .hanzi-display {
    font-size: 2.5rem;
  }

  .hanzi-form {
    width: 250px;
    padding: 1rem;
  }

  .pinyin-input, .pinyin-input:focus {
    background-color: inherit;
    border: none;
    border-bottom: 1px solid black;
    outline: none;
    font-size: large;
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

  .control-btns {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 5px 0px;

    button {
      margin: 0px 2px;
      width: 4rem;
    }
  }
</style>