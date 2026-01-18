# TypeScript & Angular Best Practices

## TypeScript Standards

### Type Safety

✅ **Always use strict types**

```ts
// ✅ GOOD
function getUserById(id: string): User | null {
  // implementation
}

interface RequestConfig {
  timeout: number;
  retries: number;
}
```

❌ **Avoid `any`**

```ts
// ❌ BAD
function process(data: any): any {
  return data.something;
}
```

✅ **Use `unknown` when type is truly uncertain**

```ts
// ✅ GOOD - when parsing external data
function parseJSON(data: unknown): SessionModel {
  if (typeof data === 'object' && data !== null) {
    // type narrowing
  }
}
```

### Type Inference

✅ **Let TypeScript infer obvious types**

```ts
// ✅ GOOD - type is obvious
const sessionId = nanoid();
const isVoted = true;
const count = participants.length;

// ✅ GOOD - explicit when needed
const session: Session = {
  /* ... */
};
```

### Generics

✅ **Use generics for reusable utilities**

```ts
// ✅ GOOD
function createValidator<T>(schema: ZodSchema): (data: T) => T {
  return (data: T) => schema.parse(data);
}
```

## Angular Component Standards

### Standalone Components

✅ **All components must be standalone**

```ts
// ✅ GOOD
@Component({
  selector: 'app-session-card',
  template: `...`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // 'standalone: true' is DEFAULT in Angular 20+, don't add it
})
export class SessionCardComponent {
  // implementation
}
```

❌ **Never explicitly set standalone: true**

```ts
// ❌ BAD - redundant and violates our guidelines
@Component({
  selector: 'app-card',
  standalone: true,  // ❌ Don't explicitly set
})
```

### Input/Output Pattern

✅ **Use signal input/output functions**

```ts
// ✅ GOOD
import { input, output } from '@angular/core';

@Component({
  selector: 'app-vote-button',
})
export class VoteButtonComponent {
  vote = input.required<number>();
  selected = output<number>();

  onSelect() {
    this.selected.emit(this.vote());
  }
}
```

❌ **Avoid decorator-based @Input/@Output**

```ts
// ❌ BAD - old pattern
@Component({...})
export class VoteButtonComponent {
  @Input() vote!: number;
  @Output() selected = new EventEmitter<number>();
}
```

### Change Detection

✅ **Always use OnPush**

```ts
// ✅ GOOD
@Component({
  selector: 'app-vote-card',
  template: `...`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VoteCardComponent {
  // implementation
}
```

### Host Bindings

✅ **Use `host` property in decorator**

```ts
// ✅ GOOD
@Component({
  selector: 'app-card',
  host: {
    class: 'card-container',
    '[class.active]': 'isActive()',
    '[attr.aria-label]': 'title()',
  },
})
export class CardComponent {
  isActive = input(false);
  title = input.required<string>();
}
```

❌ **Avoid @HostBinding/@HostListener**

```ts
// ❌ BAD
@Component({...})
export class CardComponent {
  @HostBinding('class.active') isActive = false;
  @HostListener('click') onClick() { }
}
```

### Templates

✅ **Use modern control flow**

```html
<!-- ✅ GOOD - Angular 17+ -->
@if (isLoading()) {
<app-spinner />
} @else {
<div>{{ data() }}</div>
} @for (item of items(); track item.id) {
<app-item [item]="item" />
} @switch (status()) { @case ('pending') {
<p>Loading...</p>
} @case ('success') {
<p>Done!</p>
} }
```

❌ **Avoid old structural directives**

```html
<!-- ❌ BAD -->
<div *ngIf="isLoading; else content">Loading...</div>
<ng-template #content>
  <div [ngSwitch]="status">
    <div *ngSwitchCase="'success'">Done!</div>
  </div>
</ng-template>

<div *ngFor="let item of items; trackBy: trackByFn">{{ item }}</div>
```

✅ **Use class bindings instead of ngClass**

```html
<!-- ✅ GOOD -->
<div class="card" [class.active]="isActive()" [class.large]="size() === 'lg'">Content</div>
```

❌ **Avoid ngClass**

```html
<!-- ❌ BAD -->
<div [ngClass]="{ 'active': isActive, 'large': size === 'lg' }">Content</div>
```

✅ **Use style bindings instead of ngStyle**

```html
<!-- ✅ GOOD -->
<div [style.background-color]="bgColor()" [style.padding.px]="spacing()">Content</div>
```

### Images

✅ **Use NgOptimizedImage**

```ts
// ✅ GOOD
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-avatar',
  imports: [NgOptimizedImage],
  template: `
    <img ngSrc="assets/avatar.png" width="64" height="64" alt="User avatar" />
  `,
})
```

❌ **Avoid inline base64 or regular img tags**

```html
<!-- ❌ BAD - base64 doesn't work with NgOptimizedImage -->
<img src="data:image/png;base64,..." />
```

## State Management (NGRX SignalStore)

✅ **Use withState and withMethods**

```ts
// ✅ GOOD
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';

const initialState = {
  sessions: [] as Session[],
  loading: false,
};

export const SessionStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    addSession(session: Session) {
      patchState(store, {
        sessions: [...store.sessions(), session],
      });
    },
  })),
);
```

✅ **Use computed for derived state**

```ts
import { computed } from '@angular/core';

export const SessionStore = signalStore(
  withState(initialState),
  withComputed((store) => ({
    sessionCount: computed(() => store.sessions().length),
    activeSession: computed(() => store.sessions().find((s) => s.status === 'active')),
  })),
);
```

❌ **Don't use mutate on signals**

```ts
// ❌ BAD
store.sessions.mutate((sessions) => {
  sessions.push(newSession);
});

// ✅ GOOD instead
patchState(store, {
  sessions: [...store.sessions(), newSession],
});
```

## Service Injection

✅ **Use inject() function**

```ts
// ✅ GOOD
import { inject } from '@angular/core';

@Component({...})
export class SessionComponent {
  private websocketService = inject(WebSocketService);
  private sessionStore = inject(SessionStore);

  ngOnInit() {
    this.websocketService.connect();
  }
}
```

❌ **Avoid constructor injection**

```ts
// ❌ BAD
export class SessionComponent {
  constructor(private websocketService: WebSocketService) {}
}
```

✅ **Services use providedIn: 'root'**

```ts
// ✅ GOOD
@Injectable({ providedIn: 'root' })
export class WebSocketService {
  // singleton service
}
```

## Forms

✅ **Use Reactive Forms**

```ts
// ✅ GOOD
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
})
export class VoteForm {
  fb = inject(FormBuilder);

  form = this.fb.group({
    vote: [0, [Validators.required, Validators.min(0)]],
    comment: [''],
  });
}
```

❌ **Avoid template-driven forms**

```html
<!-- ❌ BAD -->
<form (ngSubmit)="onSubmit()">
  <input [(ngModel)]="vote" />
</form>
```

## Accessibility

✅ **Always include ARIA labels and semantic HTML**

```html
<!-- ✅ GOOD -->
<button [attr.aria-label]="'Vote for ' + storyTitle()" [disabled]="isVoted()">
  {{ storyTitle() }}
</button>

<h1>Sprint Planning</h1>
<nav [attr.aria-label]="'Main navigation'">
  <!-- nav items -->
</nav>
```

✅ **Ensure color contrast and keyboard navigation**

```ts
// ✅ GOOD - keyboard support
@Component({
  host: {
    '(keydown.enter)': 'onEnter()',
    '(keydown.space)': 'onSpace()',
  },
})
```

## Testing

✅ **Write tests in .spec.ts files**

```ts
// ✅ GOOD - vitest/testing-library
import { render, screen } from '@testing-library/angular';

describe('VoteButtonComponent', () => {
  it('should emit selected vote', async () => {
    const { component } = await render(VoteButtonComponent, {
      componentInputs: { vote: 5 },
    });

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(component.selected.emit).toHaveBeenCalledWith(5);
  });
});
```

## Complexity Limits

⚠️ **Max cyclomatic complexity: 5 per function**

```ts
// ✅ GOOD - simple logic
function validateVote(vote: number): boolean {
  return vote >= 0 && ALLOWED_VOTES.includes(vote);
}

// ❌ BAD - too many branches
function processVote(vote: number, user: User, session: Session) {
  if (vote < 0) return false;
  if (!ALLOWED_VOTES.includes(vote)) return false;
  if (!user.isActive) return false;
  if (session.status !== 'voting') return false;
  if (user.hasVoted && !user.canChangeVote) return false;
  // Extract into smaller functions!
}
```
