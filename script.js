class SortingVisualizer {
    constructor() {
        this.array = [];
        this.isRunning = false;
        this.comparisons = 0;
        this.swaps = 0;
        this.startTime = 0;
        
        this.initializeElements();
        this.setupEventListeners();
        this.generateArray();
        this.updateAlgorithmInfo();
    }

    initializeElements() {
        this.visualization = document.getElementById('visualization');
        this.algorithmSelect = document.getElementById('algorithmSelect');
        this.sizeSlider = document.getElementById('sizeSlider');
        this.speedSlider = document.getElementById('speedSlider');
        this.sizeValue = document.getElementById('sizeValue');
        this.speedValue = document.getElementById('speedValue');
        this.generateBtn = document.getElementById('generateBtn');
        this.sortBtn = document.getElementById('sortBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.comparisonsEl = document.getElementById('comparisons');
        this.swapsEl = document.getElementById('swaps');
        this.timeEl = document.getElementById('time');
        this.algorithmName = document.getElementById('algorithmName');
        this.algorithmDescription = document.getElementById('algorithmDescription');
    }

    setupEventListeners() {
        this.sizeSlider.addEventListener('input', () => {
            this.sizeValue.textContent = this.sizeSlider.value;
            if (!this.isRunning) this.generateArray();
        });

        this.speedSlider.addEventListener('input', () => {
            this.speedValue.textContent = this.speedSlider.value;
        });

        this.algorithmSelect.addEventListener('change', () => {
            this.updateAlgorithmInfo();
        });

        this.generateBtn.addEventListener('click', () => {
            if (!this.isRunning) this.generateArray();
        });

        this.sortBtn.addEventListener('click', () => {
            this.startSort();
        });

        this.stopBtn.addEventListener('click', () => {
            this.stopSort();
        });
    }

    generateArray() {
        const size = parseInt(this.sizeSlider.value);
        this.array = [];
        
        for (let i = 0; i < size; i++) {
            this.array.push(Math.floor(Math.random() * 300) + 10);
        }
        
        this.resetStats();
        this.renderArray();
    }

    renderArray() {
        this.visualization.innerHTML = '';
        const containerWidth = this.visualization.clientWidth - 60;
        const barWidth = Math.max(2, Math.floor(containerWidth / this.array.length) - 2);
        
        this.array.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.height = `${value}px`;
            bar.style.width = `${barWidth}px`;
            bar.id = `bar-${index}`;
            this.visualization.appendChild(bar);
        });
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getDelay() {
        return 101 - parseInt(this.speedSlider.value);
    }

    async highlightBars(indices, className) {
        indices.forEach(index => {
            const bar = document.getElementById(`bar-${index}`);
            if (bar) {
                bar.className = `bar ${className}`;
            }
        });
        await this.sleep(this.getDelay());
    }

    async resetBarColor(index) {
        const bar = document.getElementById(`bar-${index}`);
        if (bar) {
            bar.className = 'bar';
        }
    }

    async markSorted(index) {
        const bar = document.getElementById(`bar-${index}`);
        if (bar) {
            bar.className = 'bar sorted';
        }
    }

    updateStats() {
        this.comparisonsEl.textContent = this.comparisons;
        this.swapsEl.textContent = this.swaps;
        this.timeEl.textContent = `${Date.now() - this.startTime}ms`;
    }

    resetStats() {
        this.comparisons = 0;
        this.swaps = 0;
        this.updateStats();
    }

    async swap(i, j) {
        if (!this.isRunning) return;
        
        await this.highlightBars([i, j], 'swapping');
        
        [this.array[i], this.array[j]] = [this.array[j], this.array[i]];
        
        const bar1 = document.getElementById(`bar-${i}`);
        const bar2 = document.getElementById(`bar-${j}`);
        
        if (bar1 && bar2) {
            [bar1.style.height, bar2.style.height] = [bar2.style.height, bar1.style.height];
        }
        
        this.swaps++;
        this.updateStats();
        
        await this.sleep(this.getDelay());
        await this.resetBarColor(i);
        await this.resetBarColor(j);
    }

    async startSort() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.startTime = Date.now();
        this.resetStats();
        
        this.sortBtn.disabled = true;
        this.generateBtn.disabled = true;
        this.algorithmSelect.disabled = true;
        this.sizeSlider.disabled = true;
        
        const algorithm = this.algorithmSelect.value;
        
        try {
            switch (algorithm) {
                case 'bubble':
                    await this.bubbleSort();
                    break;
                case 'selection':
                    await this.selectionSort();
                    break;
                case 'insertion':
                    await this.insertionSort();
                    break;
                case 'merge':
                    await this.mergeSort(0, this.array.length - 1);
                    break;
                case 'quick':
                    await this.quickSort(0, this.array.length - 1);
                    break;
            }
            
            if (this.isRunning) {
                await this.celebrateCompletion();
            }
        } catch (error) {
            console.log('Sorting stopped');
        }
        
        this.stopSort();
    }

    stopSort() {
        this.isRunning = false;
        this.sortBtn.disabled = false;
        this.generateBtn.disabled = false;
        this.algorithmSelect.disabled = false;
        this.sizeSlider.disabled = false;
    }

    async celebrateCompletion() {
        for (let i = 0; i < this.array.length; i++) {
            if (!this.isRunning) break;
            await this.markSorted(i);
            await this.sleep(20);
        }
    }

    // Bubble Sort Algorithm
    async bubbleSort() {
        const n = this.array.length;
        
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                if (!this.isRunning) return;
                
                await this.highlightBars([j, j + 1], 'comparing');
                this.comparisons++;
                this.updateStats();
                
                if (this.array[j] > this.array[j + 1]) {
                    await this.swap(j, j + 1);
                } else {
                    await this.resetBarColor(j);
                    await this.resetBarColor(j + 1);
                }
            }
            await this.markSorted(n - i - 1);
        }
    }

    // Selection Sort Algorithm
    async selectionSort() {
        const n = this.array.length;
        
        for (let i = 0; i < n - 1; i++) {
            if (!this.isRunning) return;
            
            let minIdx = i;
            await this.highlightBars([i], 'pivot');
            
            for (let j = i + 1; j < n; j++) {
                if (!this.isRunning) return;
                
                await this.highlightBars([j, minIdx], 'comparing');
                this.comparisons++;
                this.updateStats();
                
                if (this.array[j] < this.array[minIdx]) {
                    await this.resetBarColor(minIdx);
                    minIdx = j;
                } else {
                    await this.resetBarColor(j);
                }
            }
            
            if (minIdx !== i) {
                await this.swap(i, minIdx);
            }
            
            await this.markSorted(i);
        }
    }

    // Insertion Sort Algorithm
    async insertionSort() {
        const n = this.array.length;
        
        for (let i = 1; i < n; i++) {
            if (!this.isRunning) return;
            
            let key = this.array[i];
            let j = i - 1;
            
            await this.highlightBars([i], 'pivot');
            
            while (j >= 0 && this.array[j] > key) {
                if (!this.isRunning) return;
                
                await this.highlightBars([j, j + 1], 'comparing');
                this.comparisons++;
                this.updateStats();
                
                this.array[j + 1] = this.array[j];
                const bar = document.getElementById(`bar-${j + 1}`);
                if (bar) {
                    bar.style.height = `${this.array[j + 1]}px`;
                }
                
                this.swaps++;
                this.updateStats();
                
                await this.sleep(this.getDelay());
                await this.resetBarColor(j);
                await this.resetBarColor(j + 1);
                
                j--;
            }
            
            this.array[j + 1] = key;
            const bar = document.getElementById(`bar-${j + 1}`);
            if (bar) {
                bar.style.height = `${key}px`;
            }
            
            await this.resetBarColor(i);
        }
    }

    // Merge Sort Algorithm
    async mergeSort(left, right) {
        if (left >= right || !this.isRunning) return;
        
        const mid = Math.floor((left + right) / 2);
        
        await this.mergeSort(left, mid);
        await this.mergeSort(mid + 1, right);
        await this.merge(left, mid, right);
    }

    async merge(left, mid, right) {
        if (!this.isRunning) return;
        
        const leftArr = this.array.slice(left, mid + 1);
        const rightArr = this.array.slice(mid + 1, right + 1);
        
        let i = 0, j = 0, k = left;
        
        while (i < leftArr.length && j < rightArr.length) {
            if (!this.isRunning) return;
            
            await this.highlightBars([k], 'comparing');
            this.comparisons++;
            this.updateStats();
            
            if (leftArr[i] <= rightArr[j]) {
                this.array[k] = leftArr[i];
                i++;
            } else {
                this.array[k] = rightArr[j];
                j++;
            }
            
            const bar = document.getElementById(`bar-${k}`);
            if (bar) {
                bar.style.height = `${this.array[k]}px`;
            }
            
            this.swaps++;
            this.updateStats();
            
            await this.sleep(this.getDelay());
            await this.resetBarColor(k);
            k++;
        }
        
        while (i < leftArr.length) {
            if (!this.isRunning) return;
            this.array[k] = leftArr[i];
            const bar = document.getElementById(`bar-${k}`);
            if (bar) {
                bar.style.height = `${this.array[k]}px`;
            }
            i++;
            k++;
        }
        
        while (j < rightArr.length) {
            if (!this.isRunning) return;
            this.array[k] = rightArr[j];
            const bar = document.getElementById(`bar-${k}`);
            if (bar) {
                bar.style.height = `${this.array[k]}px`;
            }
            j++;
            k++;
        }
    }

    // Quick Sort Algorithm
    async quickSort(low, high) {
        if (low < high && this.isRunning) {
            const pi = await this.partition(low, high);
            await this.quickSort(low, pi - 1);
            await this.quickSort(pi + 1, high);
        }
    }

    async partition(low, high) {
        if (!this.isRunning) return low;
        
        const pivot = this.array[high];
        await this.highlightBars([high], 'pivot');
        
        let i = low - 1;
        
        for (let j = low; j < high; j++) {
            if (!this.isRunning) return low;
            
            await this.highlightBars([j], 'comparing');
            this.comparisons++;
            this.updateStats();
            
            if (this.array[j] < pivot) {
                i++;
                if (i !== j) {
                    await this.swap(i, j);
                }
            }
            
            await this.resetBarColor(j);
        }
        
        await this.swap(i + 1, high);
        await this.resetBarColor(high);
        
        return i + 1;
    }

    updateAlgorithmInfo() {
        const algorithm = this.algorithmSelect.value;
        const info = {
            bubble: {
                name: 'Bubble Sort',
                description: 'Compares adjacent elements and swaps them if they\'re in wrong order. Time Complexity: O(n²)'
            },
            selection: {
                name: 'Selection Sort',
                description: 'Finds minimum element and places it at beginning. Time Complexity: O(n²)'
            },
            insertion: {
                name: 'Insertion Sort',
                description: 'Builds sorted array one element at a time. Time Complexity: O(n²)'
            },
            merge: {
                name: 'Merge Sort',
                description: 'Divides array and merges sorted halves. Time Complexity: O(n log n)'
            },
            quick: {
                name: 'Quick Sort',
                description: 'Partitions around pivot and recursively sorts. Time Complexity: O(n log n)'
            }
        };
        
        this.algorithmName.textContent = info[algorithm].name;
        this.algorithmDescription.textContent = info[algorithm].description;
    }
}

// Initialize the visualizer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SortingVisualizer();
});