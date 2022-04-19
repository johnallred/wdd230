const urls = require('../fixtures/students.json');
const begin_html = require('../fixtures/begin.json');
const end_html = require('../fixtures/end.json');
let student_string = '';
let base_url = '';
let current_url = '';

describe(`Week 1`, () => { 
    after(() => {
        cy.writeFile("week1.html", begin_html + student_string + end_html);
    })
    urls.forEach(url => {
    //Cypress.env('urls').forEach(url => {
        describe(`Current student: ${url}`, () => {
            before(() => {
                base_url = `https://${url}.github.io/wdd230/`;
                current_url = `${base_url}/index.html`;
                cy.visit(current_url) ;
                student_string += `students.push({name:'${url}',link:'${current_url}'});`;
            })

            it('Contains header Element', () => {
                cy.get('header');
            })
        
            it('Contains main Element', () => {
                cy.get('main');
            })
        
            it('Contains footer Element', () => {
                cy.get('footer'); 
            })

            it('Contains h1 Element', () => {
                cy.get('h1'); 
            })

            it('Contains h2 Element', () => {
                cy.get('h2'); 
            })

            it('ID only used once', () => {
                let duplicate_array = [];
                cy.get('[id]')
                .each(($match) => {
                    cy.wrap($match)
                    .invoke('attr', 'id')
                    .then((id) => {
                        duplicate_array.push(id);
                        const unique = new Set(duplicate_array);
                        expect(duplicate_array.length).to.eq(unique.size);
                    })
                });
            })
        
            it('Header Element uses Flex or Grid', () => {
                cy.get('header')
                .invoke('css', 'display')
                .then((display) => {
                    expect(display).to.be.oneOf(['flex','grid'])
                });
            })
        
            it('Contains Correct Doctype', () => {
                cy.document()
                .then(doc => {
                    expect(doc.doctype !== undefined).to.eq(true)
                    expect(doc.doctype.name).to.eq('html')
                });
            })
        
            it('Contains Correct Charset', () => {
                cy.document().its('charset').should('eq', 'UTF-8');
            })
        
            it('Contains Correct Viewport', () => {
                cy.document()
                .get('head meta[name=viewport]')
                .invoke('attr', 'content')
                .should('include', 'width=device-width, initial-scale=1');
            })
        
            it('Contains Correct Language', () => {
                cy.document()
                .get('html')
                .invoke('attr', 'lang')
                .should('eq', 'en-US');
            })
        
            it('Contains Title', () => {
                cy.title()
                .then((title) => {
                    expect(title).to.have.length.of.at.least(3)
                });
            })
        
            it('Contains Correct Description', () => {
                cy.document()
                .get('head meta[name=description]')
                .invoke('attr', 'content')
                .then((content) => {
                    expect(content).to.have.length.of.at.least(3)
                    expect(content).to.have.length.of.at.most(150)
                });
            })

            it('Contains Copyright Symbol', () => {
                cy.contains('©'); 
            })
        
            it('Img have alt', () => {
                cy.get('img')
                .each(($match) => {
                    cy.wrap($match)
                    .invoke('attr', 'alt')
                    .then((alt) => {
                        expect(alt).to.have.length.of.at.least(3)
                    })
                });
            })
        
            it('Img in images folder', () => {
                cy.get('img')
                .each(($match) => {
                    cy.wrap($match)
                    .invoke('attr', 'src')
                    .then((src) => {
                        expect(src).to.match(/images/)
                    })
                });
            })

            it('CSS in css folder', () => {
                cy.get('link')
                .each(($match) => {
                    cy.wrap($match)
                    .invoke('attr', 'href')
                    .then((href) => {
                        expect(href).to.match(/css/)
                    })
                });
            })
        
            it('JavaScript in js folder', () => {
                cy.request(current_url)
                .its('body')          // NB the response body, not the body of your page
                .then(content => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(content, 'text/html')
        
                    const scripts = doc.querySelectorAll('head script')    // native query
                    const srcs = [...scripts].map(script => script.getAttribute('src'))
                    //expect(srcs.every(src => src.startsWith('js/'))).to.eq(true)
                    srcs.forEach(src => expect(src).to.match(/^js/))
                });
            })

            it("HTML validation", () => {
                cy.request({
                  url: `https://validator.nu/?doc=${current_url}&out=json`
                }).then((resp) => {
                  cy.log(resp.body.messages)
                })
            })

            it("CSS validation", () => {
                cy.request({
                  url: `http://jigsaw.w3.org/css-validator/validator?medium=screen&output=text&uri=${encodeURIComponent(current_url)}`
                }).then((resp) => {
                    expect(resp.body).contains('No Error Found')
                })
            })

            it('CSS external check', () => {
                cy.get('link')
                .each(($match) => {
                    cy.wrap($match)
                    .invoke('attr', 'href')
                    .then((href) => {
                        let css_url = `${base_url}${href}`;
                        cy.request({
                            url: `http://jigsaw.w3.org/css-validator/validator?medium=screen&output=text&uri=${encodeURIComponent(css_url)}`
                        }).then((resp) => {
                            expect(resp.body).contains('No Error Found')
                        })
                    })
                });
            })

        })
    })
})