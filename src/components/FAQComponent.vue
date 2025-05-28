<script setup lang="ts">
interface FAQQuestion {
  title: string;
  answer: string;
}

defineProps({
  questions: {
    type: Array as () => FAQQuestion[],
    required: true,
  },
});

const questionOpened = ref();
function toggleQuestion(index: number) {
  if (questionOpened.value === index) {
    questionOpened.value = undefined;
  } else {
    questionOpened.value = index;
  }
}
</script>
<template>
  <div class="faq-component">
    <div
      class="faq-component__card"
      v-for="(question, index) in questions"
      :key="index"
      @click="toggleQuestion(index)"
    >
      <h5 class="faq-component__card__question">
        {{ question.title }}
        <IconComponent
          :icon="
            questionOpened === index ? 'caret_down_bold' : 'caret_right_bold'
          "
          size="1.5rem"
        />
      </h5>
      <p class="faq-component__card__answer" v-if="questionOpened === index">
        {{ question.answer }}
      </p>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.faq-component {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  width: fit-content;
  gap: 2rem;
  width: 100%;

  @media (min-width: $big-tablet-screen) {
    grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
    gap: 4rem;
  }

  &__card {
    border-radius: $radius;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: 100%;
    max-width: 800px;
    height: fit-content;
    gap: 1rem;
    cursor: pointer;

    @media (min-width: $big-tablet-screen) {
      min-width: 500px;
    }

    @media (min-width: $laptop-screen) {
    }

    &__question {
      display: flex;
      align-items: center;
      gap: 1rem;
      width: 100%;
      height: fit-content;
      font-size: 1rem;
      font-weight: $regular;
      color: $text-color-alt;

      @media (min-width: $big-tablet-screen) {
        font-size: $subtitles;
      }
    }

    &__answer {
      font-size: 1rem;
      font-weight: $regular;
      animation: fading 0.3s;
      width: 100%;
      line-height: $subtitles;
    }

    &__link {
      animation: fading 0.4s;
      width: fit-content;
    }
  }
}
</style>
