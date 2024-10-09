import './style.css'
import { Canvas } from './Canvas';
import { CircleElement } from './webComponents/CircleElement';

customElements.define('circle-element', CircleElement);

const circleElement = document.createElement('circle-element');
circleElement.innerText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In turpis nibh, bibendum quis tortor at, elementum vestibulum sapien. In sit amet est a mauris finibus ullamcorper a eu ex. Praesent vel bibendum quam. Pellentesque imperdiet tortor a massa ultricies, ut laoreet enim ultrices. Fusce hendrerit consequat orci, vitae fringilla turpis feugiat tristique. Vivamus tincidunt, nibh sed tempus condimentum, mi dui dictum risus, sed mattis eros lacus sed ipsum. Etiam condimentum nunc sit amet est lobortis, sed imperdiet purus vehicula. Praesent et mi vel mauris dapibus tincidunt. Phasellus et pellentesque velit, euismod porttitor quam. Suspendisse nibh dolor, rutrum et ex sed, congue eleifend justo.';

document.getElementById("app")?.appendChild(circleElement);

//Canvas();


