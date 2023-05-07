import {createDirectiveFactory, SpectatorDirective} from "@ngneat/spectator";
import {BindDirective} from "./bind.directive";

declare var jest:any
describe('BindDirective', () => {
  let spectator: SpectatorDirective<BindDirective>;
  const createDirective = createDirectiveFactory(BindDirective);


  it('should set the correct attributes', () => {
    spectator = createDirective(`<div ngxBind>Testing Bind Directive</div>`, {
      props: {
        input: {
          id: '1',
          for:'1'
        }
      }
    });

    expect(spectator.element).toHaveAttribute({
      id: '1',
      for: '1'
    });
  });

  it('should remove the correct attributes', () => {
    spectator = createDirective(`<div ngxBind>Testing Bind Directive</div>`, {
      props: {
        input: {
          id: '1',
          for:'1'
        }
      }
    });

    expect(spectator.element).toHaveAttribute({
      id: '1',
      for: '1'
    });

    spectator.setInput({
      input: {
        id: '1',
      }
    })

    expect(spectator.element).toHaveAttribute({
      id: '1',
    });
  });

  it('should listen to event', () => {
    const onClick = jest.fn();


    spectator = createDirective(`<div ngxBind>Testing Bind Directive</div>`, {
      props: {
        input: {
          onClick:onClick
        }
      }
    });
    spectator.dispatchTouchEvent(spectator.element, 'click');

    expect(onClick.mock.calls).toHaveLength(1);

  });
  it('should unlisten to event ', () => {

    const onClickFn = jest.fn()
    const onClickSecondFn = jest.fn()
    const onClick= ()=>onClickFn()
    const onClickSecond= ()=>onClickSecondFn()

    spectator = createDirective(`<div ngxBind>Testing Bind Directive</div>`, {
      props: {
        input: {
          onClick:onClick
        }
      }
    });
    spectator.dispatchTouchEvent(spectator.element, 'click');
    expect(onClickFn.mock.calls).toHaveLength(1);

    spectator.setInput({
      input: {
        onClick: onClickSecond,
      }
    })

    spectator.dispatchTouchEvent(spectator.element, 'click');

    expect(onClickFn.mock.calls).toHaveLength(1);
    expect(onClickSecondFn.mock.calls).toHaveLength(1);

  });

  it('should get the instance', () => {
    const instance = spectator.directive;
    expect(instance).toBeDefined();
  });
});
