<style scoped>
.emoji-cursor-1 {
    cursor:
        url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><text y="24" font-size="24">🔥</text></svg>')
            16 16,
        auto;
}
</style>

<template>
    <div
        class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-white px-4"
    >
        <!-- Título -->
        <h1 class="text-6xl font-bold mb-10">TicTacToe</h1>

        <div class="w-80 mb-4">
            <code class="w-full">
                {{
                    {
                        turnIcon,
                        winnerCombination,
                        'iconTheme.icons': iconTheme?.icons,
                        isStarted,
                    }
                }}
            </code>
        </div>

        <div class="grid md:grid-cols-2 gap-14">
            <!-- Área do jogo -->
            <div class="bg-gray-800/50 border w-80 border-gray-700 rounded-2xl p-6">
                <div class="mb-4">
                    <p class="text-lg font-semibold">Icon themes: {{ iconTheme?.icons.join(' / ') }}</p>

                    <p class="text-lg font-semibold">
                        <span>Next player: X</span>
                        <span v-show="isStarted">({{ turnIcon }})</span>
                    </p>

                    <p class="text-lg font-semibold min-h-3">
                        <span v-show="haveAwinner">🎉 Winner 🎊 !!!</span>

                        <span v-show="isDraw">Draw ❌ !!!</span>
                    </p>
                </div>

                <!-- Tabuleiro 3x3 -->
                <div
                    class="grid grid-cols-3 gap-2"
                    :class="{
                        'emoji-cursor': !haveAwinner,
                        'cursor-not-allowed': haveAwinner,
                    }"
                >
                    <button
                        v-for="(square, squareIndex) in squareSlots"
                        :key="square"
                        class="aspect-square rounded-xl text-3xl font-bold flex items-center justify-center transition"
                        :class="{
                            'cursor-pointer': !haveAwinner && square?.available,
                            'cursor-not-allowed': !square?.available || haveAwinner,
                            'bg-gray-700 hover:bg-gray-600': !isDraw && !winnerCombination.includes(squareIndex),
                            'text-gray-700 bg-gray-200': !isDraw && winnerCombination.includes(squareIndex),
                            'text-gray-700 bg-orange-500': isDraw,
                        }"
                        type="button"
                        @click.stop.prevent="whenClickOnSquare(square)"
                        :data-square-index="squareIndex"
                        :disabled="haveAwinner"
                    >
                        <span class="text-xs">{{ squareIndex }}</span>
                        <span>{{ square?.content }}</span>
                    </button>
                </div>

                <div class="w-full mt-4">
                    <button
                        class="cursor-pointer w-full bg-green-600 hover:bg-green-500 text-white font-medium py-2 rounded-xl transition mb-8"
                        type="button"
                        :disabled="!isStarted"
                        v-show="isStarted"
                        @click.stop.prevent="resetGame"
                    >
                        Reset Game
                    </button>
                </div>
            </div>

            <!-- Painel lateral -->
            <div class="bg-gray-800/50 border md:w-80 border-gray-700 rounded-2xl p-6 w-full max-w-sm">
                <h2 class="text-lg font-semibold mb-4" v-show="!isStarted">Game Settings</h2>

                <!-- Modo de jogo -->
                <div class="mb-6" v-show="!isStarted">
                    <label class="block text-sm font-medium mb-2">Select Game Mode:</label>
                    <div class="flex gap-2">
                        <button
                            type="button"
                            :disabled="isStarted"
                            :class="{
                                'cursor-not-allowed': isStarted,
                            }"
                            class="flex-1 py-2 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-500 transition"
                        >
                            Vs. Computer
                        </button>
                        <button
                            type="button"
                            :disabled="isStarted"
                            :class="{
                                'cursor-not-allowed': isStarted,
                            }"
                            class="flex-1 py-2 rounded-xl text-sm font-medium bg-gray-700 hover:bg-gray-600 transition"
                        >
                            Vs. Human
                        </button>
                    </div>
                </div>

                <!-- Dificuldade -->
                <div class="mb-6" v-show="!isStarted">
                    <label class="block text-sm font-medium mb-2">AI Difficulty:</label>
                    <select
                        class="w-full rounded-xl bg-gray-700 border border-gray-600 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        :disabled="isStarted"
                        :class="{
                            'cursor-not-allowed': isStarted,
                        }"
                    >
                        <option>Easy</option>
                        <option>Medium</option>
                        <option selected>Hard</option>
                    </select>
                </div>

                <div class="mb-6" v-show="!isStarted">
                    <label class="block text-sm font-medium mb-2">Group icon theme:</label>
                    <select
                        class="w-full rounded-xl bg-gray-700 border border-gray-600 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        v-model="iconThemeIndex"
                        :disabled="isStarted"
                        :class="{
                            'cursor-not-allowed': isStarted,
                        }"
                    >
                        <option
                            v-for="(iconGroup, iconGroupIndex) in AVAILABLE_ICONS"
                            :key="iconGroupIndex"
                            :value="iconGroupIndex"
                        >
                            {{ iconGroup.join(' / ') }}
                        </option>
                    </select>
                </div>

                <!-- Reset -->
                <button
                    class="cursor-pointer w-full bg-green-600 hover:bg-green-500 text-white font-medium py-2 rounded-xl transition mb-8"
                    type="button"
                    :disabled="!isStarted"
                    v-show="isStarted"
                    @click.stop.prevent="resetGame"
                >
                    Reset Game
                </button>

                <!-- Histórico -->
                <div>
                    <h3 class="text-md font-semibold mb-2">Game History</h3>
                    <button class="w-full bg-gray-700 hover:bg-gray-600 text-sm py-2 rounded-xl transition">
                        Go to game start
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const AVAILABLE_ICONS = [
    ['🔴', '🟢'],
    ['❌', '🟢'],
    ['❌', '⭕'],
    ['🔵', '🔴'],
    ['⚫', '⚪'],
    ['🐱', '🐶'],
    ['🌞', '🌜'],
    ['🌊', '🔥'],
    ['😂', '😡'],
    ['⚔️', '🛡️'],
];

const genIcons = function (icon0: string, icon1: string) {
    return {
        icon0,
        icon1,
        icons: [icon0, icon1],
    };
};

const iconThemeIndex = ref(0);

const iconTheme = computed(() => genIcons(...AVAILABLE_ICONS[iconThemeIndex.value ?? 0]));
const turn = ref(0);
const invertTurn = () => {
    turn.value = turn.value ? 0 : 1;
};

const makeSquareSlot = (content: string | null = null, available: boolean = true) => {
    return {
        available: !content || !content?.trim(),
        content,
    };
};

const turnIcon = computed(() => iconTheme.value?.icons[turn.value ?? 0]);

const squareSlots = ref([
    makeSquareSlot(),
    makeSquareSlot(),
    makeSquareSlot(),

    makeSquareSlot(),
    makeSquareSlot(),
    makeSquareSlot(),

    makeSquareSlot(),
    makeSquareSlot(),
    makeSquareSlot(),
]);

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

const winnerCombination = computed(() => {
    const board = squareSlots.value.map((i: any) => i?.content);

    for (const [a, b, c] of winningCombinations) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return [a, b, c];
        }
    }

    return [];
});

const markedCount = computed(() => Number(squareSlots.value.filter((i: any) => i?.content)?.length || 0));
const isStarted = computed(() => Boolean(markedCount.value));

const haveAwinner = computed(() => {
    const board = squareSlots.value.map((i: any) => i?.content);

    for (const [a, b, c] of winningCombinations) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    return false;
});

const isDraw = computed(() => markedCount.value === 9 && !haveAwinner.value);

const whenClickOnSquare = (item: any) => {
    if (haveAwinner.value || !item?.available || item?.content?.trim()) {
        return;
    }

    item.content = turnIcon.value ?? '';
    invertTurn();
};

const resetGame = () => {
    squareSlots.value.map((i: any) => {
        i.available = true;
        i.content = '';

        return i;
    });
};
</script>
