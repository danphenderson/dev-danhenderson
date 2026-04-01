import type { BlogPost } from '../types/blog';

export const blogPosts: BlogPost[] = [
  {
    slug: 'fixing-and-enforcing-none-type-drift-with-a-codemod',
    title: 'Fixing and Enforcing None-Type Drift with a Codemod',
    subtitle:
      'How a syntax-aware codemod turns nullable-type conventions into enforceable repository policy.',
    excerpt:
      'Python codebases often accumulate subtle typing drift around None: semantically equivalent annotations diverge, and defaults of None stop matching their type signatures. Typewriter tackles that specific problem with a small, syntax-aware codemod that makes nullable intent consistent enough to enforce across a real repository.',
    author: 'Daniel Henderson',
    publishedAt: '2026-03-23',
    readingTimeMinutes: 9,
    tags: ['python', 'typing', 'codemods', 'architecture'],
    featured: true,
    content: [
      {
        type: 'paragraph',
        text: 'Python codebases often accumulate a subtle kind of typing drift around `None`. Semantically equivalent annotations appear in different forms, such as `Union[..., None]` and `Optional[...]`, while parameters or variables that default to `None` are not always annotated as nullable at all. Over time, that drift creates review noise, weakens the signal of the type system, and makes intent harder to trust at a glance.',
      },
      {
        type: 'paragraph',
        text: 'Typewriter started as a response to exactly that problem in the Playwright Python repository. It has since evolved into a narrowly scoped, syntax-aware codemod for enforcing consistent nullable-type conventions across real codebases.',
      },
      {
        type: 'paragraph',
        text: 'This is not a general-purpose typing cleanup tool. Its value comes from being specific: it focuses on one recurring class of inconsistency, applies a small set of structural rewrites, and produces output that is consistent enough to use in normal repository workflows.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'The problem with None annotations in Python',
        id: 'problem-with-none-annotations',
      },
      {
        type: 'paragraph',
        text: 'Typewriter began as a practical answer to a recurring inconsistency: different authors expressed the same nullable intent in different ways.',
      },
      {
        type: 'paragraph',
        text: 'These two annotations are semantically equivalent:',
      },
      {
        type: 'code',
        language: 'python',
        code: `from typing import Optional

x: Optional[T] = None`,
      },
      {
        type: 'code',
        language: 'python',
        code: `from typing import Union

x: Union[T, None] = None`,
      },
      {
        type: 'paragraph',
        text: 'Once both conventions appear throughout a repository, consistency starts to erode. Reviewers have to decide whether the difference is intentional or incidental, and a codebase that mixes equivalent spellings communicates less clearly than it should.',
      },
      {
        type: 'paragraph',
        text: 'The more serious drift appears when the annotation no longer matches the contract implied by the default value:',
      },
      {
        type: 'code',
        language: 'python',
        filename: 'module_one.py',
        code: `from typing import Optional

def f(x: Union[T, V] = None): ...`,
      },
      {
        type: 'paragraph',
        text: 'Assuming `T` and `V` are not themselves nullable, this annotation is incomplete. The default value says `None` is valid, but the type does not. At that point, the problem is no longer style. The type signature is underspecifying the API.',
      },
      {
        type: 'paragraph',
        text: 'These inconsistencies add up:',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'reviewers cannot easily tell whether differences are intentional',
          'static analysis becomes less trustworthy',
          'repository-wide conventions become harder to enforce mechanically',
        ],
      },
      {
        type: 'paragraph',
        text: 'Existing tools only cover part of the problem. Formatters can normalize layout. Linters and type checkers can catch some issues. But they generally do not perform the structural rewrite needed to turn a fuzzy convention into a consistent policy across a repository.',
      },
      {
        type: 'paragraph',
        text: 'The fix is conceptually simple. Doing it safely across hundreds or thousands of lines is not.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'A codemod approach',
        id: 'a-codemod-approach',
      },
      {
        type: 'paragraph',
        text: 'Typewriter addresses this problem with a deliberately narrow rewrite surface:',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'rewrite Union[..., None] as Optional[...]',
          'wrap T in Optional[T] when an annotated name defaults to None, unless it is already optional or Any',
          'add Optional imports only when needed',
          'remove Union imports when they are no longer used',
        ],
      },
      {
        type: 'paragraph',
        text: 'That scope is intentionally small, but it covers a surprisingly large share of real type-hint cleanup churn.',
      },
      {
        type: 'paragraph',
        text: 'A canonical transformation looks like this:',
      },
      {
        type: 'code',
        language: 'python',
        code: `# before
from typing import Union

def f(x: Union[int, None] = None) -> Union[str, None]:
    ...

# after
from typing import Optional

def f(x: Optional[int] = None) -> Optional[str]:
    ...`,
      },
      {
        type: 'paragraph',
        text: 'The point is not to impose a stylistic preference for its own sake. The point is to eliminate ambiguity and make nullable intent mechanically obvious. By constraining the rewrite surface, the codemod becomes easier to reason about, safer to run across many files, and more useful as an enforcement tool rather than a one-off cleanup script.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Why import handling matters',
        id: 'why-import-handling-matters',
      },
      {
        type: 'paragraph',
        text: 'Rewriting the annotation itself is only part of the job. Even a correct transformation can leave a file in a worse state if it introduces a new reference style or forgets to clean up imports.',
      },
      {
        type: 'paragraph',
        text: 'Two design decisions were necessary to keep the output trustworthy.',
      },
      {
        type: 'paragraph',
        text: 'First, Typewriter preserves qualified references. If a file uses `typing.Union[int, None]`, the rewrite becomes `typing.Optional[int]` rather than introducing a new `from typing import Optional` import style. That avoids creating mixed conventions within the same module.',
      },
      {
        type: 'paragraph',
        text: 'Second, imports are treated as part of the transformation itself. Introducing `Optional` may require adding an import. Eliminating the last remaining `Union` use should remove its import. The codemod does not just rewrite one expression and walk away; it leaves the file internally consistent.',
      },
      {
        type: 'paragraph',
        text: 'That matters more than it might seem. Clean codemod output is not just about producing valid syntax. It is about preserving local conventions and making the transformed file feel like it still belongs in the codebase.',
      },
      {
        type: 'paragraph',
        text: 'In practice, that means managing three things together:',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'rewrite the type annotation',
          "preserve the file's existing reference convention",
          'update imports to match the new code',
        ],
      },
      {
        type: 'paragraph',
        text: 'That combination is what makes the transformation feel safe enough to run broadly.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Adapting to repository syntax policy',
        id: 'adapting-to-repository-syntax-policy',
      },
      {
        type: 'paragraph',
        text: 'The same principle applies beyond imports. Not every repository wants the same surface syntax.',
      },
      {
        type: 'paragraph',
        text: 'Some codebases still target Python 3.9-compatible `Optional[...]` annotations. Others have standardized on Python 3.10+ syntax such as `T | None`. Typewriter supports both. By default, it emits `Optional[...]`. With `--target-version 3.10`, it normalizes toward PEP 604 unions instead.',
      },
      {
        type: 'paragraph',
        text: 'That flexibility is important because the tool is not meant to enforce my preferred spelling. It is meant to enforce the convention that the repository has already decided to adopt.',
      },
      {
        type: 'paragraph',
        text: 'A codemod becomes much more useful once it aligns with repository policy instead of fighting it.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Why this has to be syntax-aware',
        id: 'why-this-has-to-be-syntax-aware',
      },
      {
        type: 'paragraph',
        text: 'At first glance, the rewrite rule sounds simple: normalize `Union[..., None]`, and make `= None` defaults explicitly nullable. In practice, even this narrow transformation has to handle real structural variation:',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'Union[None, T] and Union[T, None] should both normalize cleanly',
          'nested forms such as Union[int, Union[str, None]] need to be interpreted correctly',
          'existing optional annotations should not be double-wrapped',
          'Any should be skipped, since it is already nullable by convention',
          'forward references like "T" should be preserved',
          'Python 3.10+ syntax like T | None must be handled alongside Union[T, None]',
        ],
      },
      {
        type: 'paragraph',
        text: 'These are not edge cases in the abstract. They are the ordinary shape of Python code in a large repository. This is where text-based substitution stops being reliable.',
      },
      {
        type: 'paragraph',
        text: 'Typewriter works against the concrete syntax tree of a module, which lets it reason about annotation structure instead of matching text patterns. That implementation detail is the real point. The value of the codemod is not that it can perform a clever rewrite once. It is that a well-defined transformation can run safely enough to enforce across a real codebase.',
      },
      {
        type: 'paragraph',
        text: 'Once consistency matters at repository scale, close enough replacement with `sed` or ad hoc regex stops being good enough.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'From cleanup script to repository policy',
        id: 'from-cleanup-script-to-repository-policy',
      },
      {
        type: 'paragraph',
        text: 'That shift is what makes Typewriter useful beyond a one-time refactor.',
      },
      {
        type: 'paragraph',
        text: 'In check mode, it can scan a repository, show diffs without modifying files, and fail CI when `None`-related typing drift reappears. It also supports machine-readable JSON output, which makes it easier to integrate with automation and review tooling.',
      },
      {
        type: 'paragraph',
        text: 'At that point, the codemod stops behaving like a cleanup script and starts behaving like enforceable repository policy.',
      },
      {
        type: 'paragraph',
        text: 'That is a modest goal, but a valuable one. When nullable intent is expressed consistently, annotations become easier to trust, reviews get quieter, and a fuzzy convention becomes a rule the repository can actually enforce.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Conclusion',
        id: 'conclusion',
      },
      {
        type: 'paragraph',
        text: "Typewriter is not trying to redesign Python's type system or standardize every typing convention at once. It takes one recurring source of ambiguity, how nullable intent is expressed, and turns it into a small, repeatable, structural transformation.",
      },
      {
        type: 'paragraph',
        text: 'By keeping the rewrite surface narrow, preserving local reference style, and treating imports as part of the transformation, the tool stays practical enough to run across real repositories instead of remaining a clever one-off idea.',
      },
      {
        type: 'paragraph',
        text: 'That is what makes it useful. The result is not dramatic, but it is durable: cleaner annotations, less review noise, and a type convention that becomes enforceable rather than aspirational.',
      },
    ],
  },
];
