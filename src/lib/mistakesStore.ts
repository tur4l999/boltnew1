// Singleton mistakes store with reactive capabilities
class MistakesStore {
  private mistakes = new Set<string>();
  private subscribers = new Set<() => void>();

  add(questionId: string): void {
    if (!this.mistakes.has(questionId)) {
      this.mistakes.add(questionId);
      this.notifySubscribers();
    }
  }

  remove(questionId: string): void {
    if (this.mistakes.has(questionId)) {
      this.mistakes.delete(questionId);
      this.notifySubscribers();
    }
  }

  clear(): void {
    if (this.mistakes.size > 0) {
      this.mistakes.clear();
      this.notifySubscribers();
    }
  }

  has(questionId: string): boolean {
    return this.mistakes.has(questionId);
  }

  getAll(): string[] {
    return Array.from(this.mistakes);
  }

  subscribe(callback: () => void): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback());
  }
}

export const mistakesStore = new MistakesStore();