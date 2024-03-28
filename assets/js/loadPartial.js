// load components html files from component folder
function loadPartial(path, component, targetSelector, newContent, appendable = false) {
    const targetElement = document.querySelector(targetSelector);

    console.log(targetSelector);
    if (!targetElement) {
        console.error(`Error loading ${component}: Target element '${targetSelector}' not found.`);
        return;
    }
    //.kanban-card-item:last-child
    fetch(`${path}/${component}`)
        .then(response => response.text())
        .then(html => {
            if (appendable) {
                targetElement.insertAdjacentHTML('beforeend', html);
                var xtargetElement = document.querySelector(targetSelector + ' .kanban-card-item:last-child');
                // console.log('enw ' + xtargetElement);
            } else {
                targetElement.innerHTML = html;
            }
            if (newContent) {
                for (let className in newContent) {
                    if (newContent.hasOwnProperty(className)) {
                        const content = newContent[className];
                        const elements = targetElement.querySelectorAll(className);

                        if (appendable) {
                            for (let i = 0; i < elements.length; i++) {
                                elements[i].innerHTML = content;
                            }
                        }

                        if (!appendable) {
                            for (let i = 0; i < elements.length; i++) {
                                elements[i].textContent = content;
                            }
                        }
                    }
                }
            }
        })
        .catch(error => {
            console.error(`Error loading ${component}:`, error);
        });

}
