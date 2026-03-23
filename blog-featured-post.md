# Fixing and Enforcing None-Type Drift with a Coded

Python codebases often accumulate a subtle kind of typing drift around `None`. Semantically equivalent annotations appear in different forms, such as `Union[..., None]` and `Optional[...]`, while parameters or variables that default to `None` are not always annotated as nullable at all. Over time, that drift creates review noise, weakens the signal of the type system, and makes intent harder to trust at a glance.

Typewriter started as a response to exactly that problem in the Playwright Python repository. It has since evolved into a narrowly scoped, syntax-aware codemod for enforcing consistent nullable-type conventions across real codebases.

This is not a general-purpose typing cleanup tool. Its value comes from being specific: it focuses on one recurring class of inconsistency, applies a small set of structural rewrites, and produces output that is consistent enough to use in normal repository workflows.

## The problem with `None` annotations in Python

Typewriter began as a practical answer to a recurring inconsistency: different authors expressed the same nullable intent in different ways.

These two annotations are semantically equivalent:

```python
from typing import Optional
x: Optional[T] = None
```

```python
from typing import Union
x: Union[T, None] = None
```

Once both conventions appear throughout a repository, consistency starts to erode. Reviewers have to decide whether the difference is intentional or incidental, and a codebase that mixes equivalent spellings communicates less clearly than it should.

The more serious drift appears when the annotation no longer matches the contract implied by the default value:

```python
# module_one.py
from typing import Optional

def f(x: Union[T, V] = None): ...
```

Assuming `T` and `V` are not themselves nullable, this annotation is incomplete. The default value says `None` is valid, but the type does not. At that point, the problem is no longer style. The type signature is underspecifying the API.

These inconsistencies add up:

- reviewers cannot easily tell whether differences are intentional
- static analysis becomes less trustworthy
- repository-wide conventions become harder to enforce mechanically

Existing tools only cover part of the problem. Formatters can normalize layout. Linters and type checkers can catch some issues. But they generally do not perform the structural rewrite needed to turn a fuzzy convention into a consistent policy across a repository.

The fix is conceptually simple. Doing it safely across hundreds or thousands of lines is not.

## A codemode approach

Typewriter addresses this problem with a deliberately narrow rewrite surface:

- rewrite `Union[..., None]` as `Optional[...]`
- wrap `T` in `Optional[T]` when an annotated name defaults to `None`, unless it is already optional or `Any`
- add `Optional` imports only when needed
- remove `Union` imports when they are no longer used

That scope is intentionally small, but it covers a surprisingly large share of real type-hint cleanup churn.

A canonical transformation looks like this:

```python
# before
from typing import Union

def f(x: Union[int, None] = None) -> Union[str, None]:
    ...

# after
from typing import Optional

def f(x: Optional[int] = None) -> Optional[str]:
    ...
```

The point is not to impose a stylistic preference for its own sake. The point is to eliminate ambiguity and make nullable intent mechanically obvious. By constraining the rewrite surface, the codemod becomes easier to reason about, safer to run across many files, and more useful as an enforcement tool rather than a one-off cleanup script.

## Why import handling matters

Rewriting the annotation itself is only part of the job. Even a correct transformation can leave a file in a worse state if it introduces a new reference style or forgets to clean up imports.

Two design decisions were necessary to keep the output trustworthy.

First, Typewriter preserves qualified references. If a file uses `typing.Union[int, None]`, the rewrite becomes `typing.Optional[int]`rather than introducing a new `from typing import Optional` import style. That avoids creating mixed conventions within the same module.

Second, imports are treated as part of the transformation itself. Introducing `Optional` may require adding an import. Eliminating the last remaining `Union` use should remove its import. The codemod does not just rewrite one expression and walk away; it leaves the file internally consistent.

That matters more than it might seem. Clean codemod output is not just about producing valid syntax. It is about preserving local conventions and making the transformed file feel like it still belongs in the codebase.

In practice, that means managing three things together:

- rewrite the type annotation
- preserve the file’s existing reference convention
- update imports to match the new code

That combination is what makes the transformation feel safe enough to run broadly.

## Adapting to repository syntax policy

The same principle applies beyond imports. Not every repository wants the same surface syntax.

Some codebases still target Python 3.9-compatible `Optional[...]` annotations. Others have standardized on Python 3.10+ syntax such as `T | None`. Typewriter supports both. By default, it emits `Optional[...]`. With `--target-version 3.10`, it normalizes toward PEP 604 unions instead.

That flexibility is important because the tool is not meant to enforce my preferred spelling. It is meant to enforce the convention that the repository has already decided to adopt.

A codemod becomes much more useful once it aligns with repository policy instead of fighting it.

## Why this has to be syntax-aware

At first glance, the rewrite rule sounds simple: normalize `Union[..., None]`, and make `= None` defaults explicitly nullable. In practice, even this narrow transformation has to handle real structural variation:

- `Union[None, T]` and `Union[T, None]` should both normalize cleanly
- nested forms such as `Union[int, Union[str, None]]` need to be interpreted correctly
- existing optional annotations should not be double-wrapped
- `Any` should be skipped, since it is already nullable by convention
- forward references like `"T"` should be preserved
- Python 3.10+ syntax like `T | None` must be handled alongside `Union[T, None]`

These are not edge cases in the abstract. They are the ordinary shape of Python code in a large repository. This is where text-based substitution stops being reliable.

Typewriter works against the concrete syntax tree of a module, which lets it reason about annotation structure instead of matching text patterns. That implementation detail is the real point. The value of the codemod is not that it can perform a clever rewrite once. It is that a well-defined transformation can run safely enough to enforce across a real codebase.

Once consistency matters at repository scale, “close enough” replacement with `sed` or ad hoc regex stops being good enough.

## From cleanup script to repository policy

That shift is what makes Typewriter useful beyond a one-time refactor.

In check mode, it can scan a repository, show diffs without modifying files, and fail CI when `None`-related typing drift reappears. It also supports machine-readable JSON output, which makes it easier to integrate with automation and review tooling.

At that point, the codemod stops behaving like a cleanup script and starts behaving like enforceable repository policy.

That is a modest goal, but a valuable one. When nullable intent is expressed consistently, annotations become easier to trust, reviews get quieter, and a fuzzy convention becomes a rule the repository can actually enforce.

## Conclusion

Typewriter is not trying to redesign Python’s type system or standardize every typing convention at once. It takes one recurring source of ambiguity, how nullable intent is expressed, and turns it into a small, repeatable, structural transformation.

By keeping the rewrite surface narrow, preserving local reference style, and treating imports as part of the transformation, the tool stays practical enough to run across real repositories instead of remaining a clever one-off idea.

That is what makes it useful. The result is not dramatic, but it is durable: cleaner annotations, less review noise, and a type convention that becomes enforceable rather than aspirational.
