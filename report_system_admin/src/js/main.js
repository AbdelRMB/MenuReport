new Vue({
    el: '#app', 
    data: {
        menuOpen: false,
        activeReports: [],
        oldReports: [],
        activeReportsCount: 0,
        oldReportsCount: 0,
        reportDetailsVisible: false,
        selectedReport: null,
        isAnimating: false,
        animationQueue: []
    },
    methods: {
        toggleMenu() {
            if (this.menuOpen) {
                this.closeMenu();
            } else {
                this.openMenu();
                this.createMenuStructure();
            }
        },
        openMenu() {
            fetch(`https://${GetParentResourceName()}/openMenu`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(() => {
                console.log("J'ouvre")
                this.menuOpen = true;
                document.body.style.display = 'flex';
            }).catch(err => console.error('Error opening menu:', err));
        },
        closeMenu() {
            fetch(`https://${GetParentResourceName()}/closeMenu`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(() => {
                this.menuOpen = false;
                document.body.style.display = 'none';
            }).catch(err => console.error('Error closing menu:', err));
        },
        handleReportData(reports) {
            this.activeReports = [];
            this.oldReports = [];
            this.activeReportsCount = 0;
            this.oldReportsCount = 0;

            reports.sort((a, b) => b.status - a.status);

            reports.forEach((report) => {
                let reportItem = {
                    id: report.player_id,
                    name: report.player_name,
                    time: new Date(report.report_time).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                    }) + ' ' + new Date(report.report_time).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    }),
                    status: report.status,
                    message: report.message
                };

                if (report.status) {
                    this.activeReports.push(reportItem);
                    this.activeReportsCount++;
                } else {
                    this.oldReports.push(reportItem);
                    this.oldReportsCount++;
                }
            });
        },
        displayReportDetails(report) {
            this.selectedReport = report;
            this.reportDetailsVisible = true;
            this.updateReportDetails();

            // Retirer la classe 'selected' de tous les rapports
            document.querySelectorAll('.reportItem').forEach(item => {
                item.classList.remove('selected');
            });

            // Ajouter la classe 'selected' à l'élément cliqué
            event.currentTarget.classList.add('selected');
        },
        createMenuStructure() {
            this.addToQueue(() => {
                this.isAnimating = true;
                const container = document.getElementById('app');
                container.innerHTML = '';

                const menuContainer = document.createElement('div');
                menuContainer.className = 'menuContainer';

                const sectionContainer = document.createElement('div');
                sectionContainer.id = 'menuContainer';
                sectionContainer.className = 'section reportmenulist';

                const adminTitle = document.createElement('h1');
                adminTitle.innerText = 'Admin';
                          
                const reportsSection = document.createElement('div');
                reportsSection.id = 'reportsSection';

                const reportCategory1 = document.createElement('div');
                reportCategory1.className = 'reportCategory1';
                reportCategory1.innerText = 'REPORTS:';

                const activeReportsTitle = document.createElement('div');
                activeReportsTitle.id = 'activeReportsTitle';
                activeReportsTitle.className = 'reportCategory';
                activeReportsTitle.innerText = `Reports: (${this.activeReportsCount})`;

                const activeReportsList = document.createElement('div');
                activeReportsList.className = 'reportList';
                activeReportsList.id = 'activeReports';

                this.activeReports.forEach(report => {
                    const reportItem = document.createElement('div');
                    reportItem.className = 'reportItem';
                    reportItem.addEventListener('click', () => this.displayReportDetails(report));

                    const reportPlayer = document.createElement('div');
                    reportPlayer.className = 'reportPlayer';
                    reportPlayer.innerText = `[${report.id}] ${report.name}`;

                    const reportTime = document.createElement('div');
                    reportTime.className = 'reportTime';
                    reportTime.innerText = report.time;

                    reportItem.appendChild(reportPlayer);
                    reportItem.appendChild(reportTime);
                    activeReportsList.appendChild(reportItem);
                });

                const oldReportsSection = document.createElement('div');
                oldReportsSection.id = 'oldReportsSection';

                const oldReportsTitle = document.createElement('div');
                oldReportsTitle.id = 'oldReportsTitle';
                oldReportsTitle.className = 'reportCategory';
                oldReportsTitle.innerText = `Ancien Reports (${this.oldReportsCount})`;

                const oldReportsList = document.createElement('div');
                oldReportsList.className = 'reportList';
                oldReportsList.id = 'oldReports';

                this.oldReports.forEach(report => {
                    const reportItem = document.createElement('div');
                    reportItem.className = 'reportItem';
                    reportItem.addEventListener('click', () => this.displayReportDetails(report));

                    const reportPlayer = document.createElement('div');
                    reportPlayer.className = 'reportPlayer';
                    reportPlayer.innerText = `[${report.id}] ${report.name}`;

                    const reportTime = document.createElement('div');
                    reportTime.className = 'reportTime';
                    reportTime.innerText = report.time;

                    reportItem.appendChild(reportPlayer);
                    reportItem.appendChild(reportTime);
                    oldReportsList.appendChild(reportItem);
                });

                const reportDetails = document.createElement('div');
                reportDetails.id = 'reportDetails';
                reportDetails.className = 'section';
                reportDetails.style.display = this.reportDetailsVisible ? 'block' : 'none';

                const detailStatus = document.createElement('p');
                detailStatus.id = 'detailStatus';

                const detailMessage = document.createElement('p');
                detailMessage.id = 'detailMessage';

                reportDetails.appendChild(detailStatus);
                reportDetails.appendChild(detailMessage);

                // Assembler les éléments
                sectionContainer.appendChild(adminTitle);
                sectionContainer.appendChild(reportsSection);
                reportsSection.appendChild(reportCategory1);
                reportsSection.appendChild(activeReportsTitle);
                reportsSection.appendChild(activeReportsList);
                oldReportsSection.appendChild(oldReportsTitle);
                oldReportsSection.appendChild(oldReportsList);
                sectionContainer.appendChild(oldReportsSection);
                menuContainer.appendChild(sectionContainer);
                menuContainer.appendChild(reportDetails);

                // Ajouter le menu au conteneur `app`
                container.appendChild(menuContainer);

                // Terminer l'animation
                this.isAnimating = false;
                this.playNextAnimation();
            });
        },
        updateReportDetails() {
            if (this.selectedReport) {
                const detailStatus = document.getElementById('detailStatus');
                detailStatus.innerHTML = `En ligne: <span style="color: ${this.selectedReport.status ? 'green' : 'red'};">${this.selectedReport.status ? 'Oui' : 'Non'}</span>`;

                const detailMessage = document.getElementById('detailMessage');
                detailMessage.innerText = this.selectedReport.message;

                const reportDetails = document.getElementById('reportDetails');
                reportDetails.style.display = 'block';
            }
        },
        addToQueue(animation) {
            this.animationQueue.push(animation);
            if (!this.isAnimating) {
                this.playNextAnimation();
            }
        },
        playNextAnimation() {
            if (this.animationQueue.length > 0) {
                const nextAnimation = this.animationQueue.shift();
                nextAnimation();
            }
        }
    },
    mounted() {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'F10') {
                this.toggleMenu();
            }
        });

        window.addEventListener('message', (event) => {
            if (event.data.action === 'openMenu') {
                this.handleReportData(event.data.reports);
                this.toggleMenu();
            }
        });
    }
});
